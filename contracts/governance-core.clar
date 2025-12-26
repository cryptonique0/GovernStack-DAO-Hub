;; GovernStack DAO - Core Governance Contract
;; This contract manages the core governance functionality

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-authorized (err u101))
(define-constant err-invalid-proposal (err u102))
(define-constant err-proposal-not-active (err u103))
(define-constant err-already-voted (err u104))
(define-constant err-insufficient-balance (err u105))
(define-constant err-quorum-not-met (err u106))
(define-constant err-voting-period-ended (err u107))
(define-constant err-invalid-parameter (err u108))

;; Data Variables
(define-data-var proposal-count uint u0)
(define-data-var min-proposal-threshold uint u1000000) ;; 1M tokens minimum
(define-data-var voting-period uint u1440) ;; blocks (~10 days)
(define-data-var quorum-percentage uint u40) ;; 40% quorum required
(define-data-var execution-delay uint u144) ;; blocks (~1 day)

;; Proposal Status
(define-constant status-pending u1)
(define-constant status-active u2)
(define-constant status-canceled u3)
(define-constant status-defeated u4)
(define-constant status-succeeded u5)
(define-constant status-queued u6)
(define-constant status-executed u7)

;; Data Maps
(define-map proposals
  { proposal-id: uint }
  {
    proposer: principal,
    title: (string-ascii 256),
    description: (string-utf8 1024),
    contract-address: principal,
    function-name: (string-ascii 128),
    parameters: (list 10 (buff 32)),
    start-block: uint,
    end-block: uint,
    for-votes: uint,
    against-votes: uint,
    abstain-votes: uint,
    status: uint,
    eta: (optional uint)
  }
)

(define-map votes
  { proposal-id: uint, voter: principal }
  {
    support: uint, ;; 0 = against, 1 = for, 2 = abstain
    voting-power: uint,
    block-height: uint
  }
)

(define-map voter-receipts
  { proposal-id: uint, voter: principal }
  bool
)

;; Read-only functions
(define-read-only (get-proposal (proposal-id uint))
  (map-get? proposals { proposal-id: proposal-id })
)

(define-read-only (get-proposal-count)
  (var-get proposal-count)
)

(define-read-only (get-vote (proposal-id uint) (voter principal))
  (map-get? votes { proposal-id: proposal-id, voter: voter })
)

(define-read-only (has-voted (proposal-id uint) (voter principal))
  (default-to false (map-get? voter-receipts { proposal-id: proposal-id, voter: voter }))
)

(define-read-only (get-voting-period)
  (var-get voting-period)
)

(define-read-only (get-quorum-percentage)
  (var-get quorum-percentage)
)

(define-read-only (get-min-proposal-threshold)
  (var-get min-proposal-threshold)
)

(define-read-only (get-execution-delay)
  (var-get execution-delay)
)

(define-read-only (get-proposal-state (proposal-id uint))
  (let
    (
      (proposal (unwrap! (get-proposal proposal-id) (err err-invalid-proposal)))
      (current-block block-height)
    )
    (ok (get status proposal))
  )
)

;; Public functions
(define-public (create-proposal 
  (title (string-ascii 256))
  (description (string-utf8 1024))
  (contract-address principal)
  (function-name (string-ascii 128))
  (parameters (list 10 (buff 32)))
)
  (let
    (
      (new-proposal-id (+ (var-get proposal-count) u1))
      (start-block (+ block-height u1))
      (end-block (+ start-block (var-get voting-period)))
    )
    ;; Verify proposer has minimum tokens
    (asserts! (>= (unwrap! (contract-call? .governance-token get-balance tx-sender) err-insufficient-balance)
                  (var-get min-proposal-threshold))
              err-insufficient-balance)
    
    ;; Create proposal
    (map-set proposals
      { proposal-id: new-proposal-id }
      {
        proposer: tx-sender,
        title: title,
        description: description,
        contract-address: contract-address,
        function-name: function-name,
        parameters: parameters,
        start-block: start-block,
        end-block: end-block,
        for-votes: u0,
        against-votes: u0,
        abstain-votes: u0,
        status: status-active,
        eta: none
      }
    )
    
    (var-set proposal-count new-proposal-id)
    (ok new-proposal-id)
  )
)

(define-public (cast-vote (proposal-id uint) (support uint))
  (let
    (
      (proposal (unwrap! (get-proposal proposal-id) err-invalid-proposal))
      (voter-balance (unwrap! (contract-call? .governance-token get-balance tx-sender) err-insufficient-balance))
    )
    ;; Validate proposal is active
    (asserts! (is-eq (get status proposal) status-active) err-proposal-not-active)
    
    ;; Validate voting period
    (asserts! (and (>= block-height (get start-block proposal))
                   (<= block-height (get end-block proposal)))
              err-voting-period-ended)
    
    ;; Validate hasn't voted
    (asserts! (not (has-voted proposal-id tx-sender)) err-already-voted)
    
    ;; Validate has voting power
    (asserts! (> voter-balance u0) err-insufficient-balance)
    
    ;; Record vote
    (map-set votes
      { proposal-id: proposal-id, voter: tx-sender }
      {
        support: support,
        voting-power: voter-balance,
        block-height: block-height
      }
    )
    
    (map-set voter-receipts
      { proposal-id: proposal-id, voter: tx-sender }
      true
    )
    
    ;; Update vote counts
    (if (is-eq support u1)
      (map-set proposals { proposal-id: proposal-id }
        (merge proposal { for-votes: (+ (get for-votes proposal) voter-balance) }))
      (if (is-eq support u0)
        (map-set proposals { proposal-id: proposal-id }
          (merge proposal { against-votes: (+ (get against-votes proposal) voter-balance) }))
        (map-set proposals { proposal-id: proposal-id }
          (merge proposal { abstain-votes: (+ (get abstain-votes proposal) voter-balance) }))
      )
    )
    
    (ok true)
  )
)

(define-public (queue-proposal (proposal-id uint))
  (let
    (
      (proposal (unwrap! (get-proposal proposal-id) err-invalid-proposal))
      (total-supply (unwrap! (contract-call? .governance-token get-total-supply) err-invalid-proposal))
      (total-votes (+ (+ (get for-votes proposal) (get against-votes proposal)) (get abstain-votes proposal)))
    )
    ;; Validate voting ended
    (asserts! (> block-height (get end-block proposal)) err-voting-period-ended)
    
    ;; Validate status
    (asserts! (is-eq (get status proposal) status-active) err-proposal-not-active)
    
    ;; Check quorum
    (asserts! (>= (* total-votes u100) (* total-supply (var-get quorum-percentage))) err-quorum-not-met)
    
    ;; Check if proposal passed
    (if (> (get for-votes proposal) (get against-votes proposal))
      (begin
        (map-set proposals { proposal-id: proposal-id }
          (merge proposal { 
            status: status-queued,
            eta: (some (+ block-height (var-get execution-delay)))
          }))
        (ok true)
      )
      (begin
        (map-set proposals { proposal-id: proposal-id }
          (merge proposal { status: status-defeated }))
        (ok false)
      )
    )
  )
)

(define-public (execute-proposal (proposal-id uint))
  (let
    (
      (proposal (unwrap! (get-proposal proposal-id) err-invalid-proposal))
    )
    ;; Validate status
    (asserts! (is-eq (get status proposal) status-queued) err-proposal-not-active)
    
    ;; Validate execution delay passed
    (asserts! (>= block-height (unwrap! (get eta proposal) err-invalid-proposal)) err-not-authorized)
    
    ;; Update status
    (map-set proposals { proposal-id: proposal-id }
      (merge proposal { status: status-executed }))
    
    ;; Note: Actual execution would call the specified contract function
    ;; This requires dynamic contract calls which need careful implementation
    
    (ok true)
  )
)

(define-public (cancel-proposal (proposal-id uint))
  (let
    (
      (proposal (unwrap! (get-proposal proposal-id) err-invalid-proposal))
    )
    ;; Only proposer or owner can cancel
    (asserts! (or (is-eq tx-sender (get proposer proposal))
                  (is-eq tx-sender contract-owner))
              err-not-authorized)
    
    ;; Update status
    (map-set proposals { proposal-id: proposal-id }
      (merge proposal { status: status-canceled }))
    
    (ok true)
  )
)

;; Admin functions
(define-public (set-voting-period (new-period uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (> new-period u0) err-invalid-parameter)
    (var-set voting-period new-period)
    (ok true)
  )
)

(define-public (set-quorum-percentage (new-quorum uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (and (> new-quorum u0) (<= new-quorum u100)) err-invalid-parameter)
    (var-set quorum-percentage new-quorum)
    (ok true)
  )
)

(define-public (set-min-proposal-threshold (new-threshold uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (> new-threshold u0) err-invalid-parameter)
    (var-set min-proposal-threshold new-threshold)
    (ok true)
  )
)

(define-public (set-execution-delay (new-delay uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (> new-delay u0) err-invalid-parameter)
    (var-set execution-delay new-delay)
    (ok true)
  )
)
