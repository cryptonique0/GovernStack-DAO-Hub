;; GovernStack DAO - Timelock Contract
;; Provides delayed execution for governance proposals

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-authorized (err u101))
(define-constant err-invalid-delay (err u102))
(define-constant err-transaction-not-found (err u103))
(define-constant err-transaction-already-executed (err u104))
(define-constant err-transaction-not-ready (err u105))
(define-constant err-transaction-expired (err u106))

;; Data variables
(define-data-var min-delay uint u144) ;; ~1 day in blocks
(define-data-var max-delay uint u4320) ;; ~30 days in blocks
(define-data-var grace-period uint u1440) ;; ~10 days grace period
(define-data-var transaction-count uint u0)

;; Transaction status
(define-constant status-queued u1)
(define-constant status-executed u2)
(define-constant status-canceled u3)

;; Data maps
(define-map queued-transactions
  { tx-id: uint }
  {
    target: principal,
    function-name: (string-ascii 128),
    parameters: (list 10 (buff 32)),
    eta: uint,
    status: uint,
    queued-by: principal,
    queued-at: uint
  }
)

(define-map authorized-proposers principal bool)

;; Read-only functions
(define-read-only (get-transaction (tx-id uint))
  (map-get? queued-transactions { tx-id: tx-id })
)

(define-read-only (get-min-delay)
  (var-get min-delay)
)

(define-read-only (get-max-delay)
  (var-get max-delay)
)

(define-read-only (get-grace-period)
  (var-get grace-period)
)

(define-read-only (is-authorized-proposer (proposer principal))
  (default-to false (map-get? authorized-proposers proposer))
)

;; Public functions
(define-public (queue-transaction
  (target principal)
  (function-name (string-ascii 128))
  (parameters (list 10 (buff 32)))
  (delay uint)
)
  (let
    (
      (new-tx-id (+ (var-get transaction-count) u1))
      (eta (+ block-height delay))
    )
    ;; Verify authorization
    (asserts! (or (is-eq tx-sender contract-owner)
                  (is-authorized-proposer tx-sender))
              err-not-authorized)
    
    ;; Verify delay is within bounds
    (asserts! (and (>= delay (var-get min-delay))
                   (<= delay (var-get max-delay)))
              err-invalid-delay)
    
    ;; Queue transaction
    (map-set queued-transactions
      { tx-id: new-tx-id }
      {
        target: target,
        function-name: function-name,
        parameters: parameters,
        eta: eta,
        status: status-queued,
        queued-by: tx-sender,
        queued-at: block-height
      }
    )
    
    (var-set transaction-count new-tx-id)
    (ok new-tx-id)
  )
)

(define-public (execute-transaction (tx-id uint))
  (let
    (
      (transaction (unwrap! (get-transaction tx-id) err-transaction-not-found))
      (eta (get eta transaction))
      (expiration (+ eta (var-get grace-period)))
    )
    ;; Verify transaction is queued
    (asserts! (is-eq (get status transaction) status-queued) err-transaction-already-executed)
    
    ;; Verify ETA has passed
    (asserts! (>= block-height eta) err-transaction-not-ready)
    
    ;; Verify not expired
    (asserts! (<= block-height expiration) err-transaction-expired)
    
    ;; Update status
    (map-set queued-transactions
      { tx-id: tx-id }
      (merge transaction { status: status-executed })
    )
    
    ;; Note: Actual execution would happen here
    ;; This requires dynamic contract calls
    
    (ok true)
  )
)

(define-public (cancel-transaction (tx-id uint))
  (let
    (
      (transaction (unwrap! (get-transaction tx-id) err-transaction-not-found))
    )
    ;; Only owner or queuer can cancel
    (asserts! (or (is-eq tx-sender contract-owner)
                  (is-eq tx-sender (get queued-by transaction)))
              err-not-authorized)
    
    ;; Verify transaction is queued
    (asserts! (is-eq (get status transaction) status-queued) err-transaction-already-executed)
    
    ;; Update status
    (map-set queued-transactions
      { tx-id: tx-id }
      (merge transaction { status: status-canceled })
    )
    
    (ok true)
  )
)

;; Admin functions
(define-public (set-min-delay (new-delay uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (and (> new-delay u0) (<= new-delay (var-get max-delay))) err-invalid-delay)
    (var-set min-delay new-delay)
    (ok true)
  )
)

(define-public (set-max-delay (new-delay uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (>= new-delay (var-get min-delay)) err-invalid-delay)
    (var-set max-delay new-delay)
    (ok true)
  )
)

(define-public (add-authorized-proposer (proposer principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (map-set authorized-proposers proposer true)
    (ok true)
  )
)

(define-public (remove-authorized-proposer (proposer principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (map-delete authorized-proposers proposer)
    (ok true)
  )
)
