;; GovernStack DAO - Vote Delegation Contract
;; Allows token holders to delegate their voting power

;; Constants
(define-constant err-not-authorized (err u101))
(define-constant err-invalid-delegate (err u102))
(define-constant err-self-delegation (err u103))
(define-constant err-circular-delegation (err u104))

;; Data maps
(define-map delegations
  { delegator: principal }
  { delegate: principal, delegated-at: uint }
)

(define-map delegation-power
  { delegate: principal }
  uint
)

(define-map delegation-history
  { delegator: principal, block: uint }
  principal
)

;; Read-only functions
(define-read-only (get-delegate (delegator principal))
  (map-get? delegations { delegator: delegator })
)

(define-read-only (get-delegation-power (delegate principal))
  (default-to u0 (map-get? delegation-power { delegate: delegate }))
)

(define-read-only (get-total-voting-power (voter principal))
  (let
    (
      (own-balance (unwrap-panic (contract-call? .governance-token get-balance voter)))
      (delegated-power (get-delegation-power voter))
    )
    (+ own-balance delegated-power)
  )
)

(define-read-only (get-delegate-at-block (delegator principal) (block uint))
  (default-to delegator (map-get? delegation-history { delegator: delegator, block: block }))
)

;; Public functions
(define-public (delegate-vote (delegate principal))
  (let
    (
      (delegator-balance (unwrap! (contract-call? .governance-token get-balance tx-sender) err-not-authorized))
      (current-delegate-power (get-delegation-power delegate))
    )
    ;; Prevent self-delegation
    (asserts! (not (is-eq tx-sender delegate)) err-self-delegation)
    
    ;; Check for existing delegation
    (match (get-delegate tx-sender)
      existing-delegation
      (let
        (
          (old-delegate (get delegate existing-delegation))
          (old-delegate-power (get-delegation-power old-delegate))
        )
        ;; Remove power from old delegate
        (map-set delegation-power
          { delegate: old-delegate }
          (if (>= old-delegate-power delegator-balance)
            (- old-delegate-power delegator-balance)
            u0
          )
        )
      )
      true ;; No existing delegation
    )
    
    ;; Set new delegation
    (map-set delegations
      { delegator: tx-sender }
      { delegate: delegate, delegated-at: block-height }
    )
    
    ;; Update delegate's power
    (map-set delegation-power
      { delegate: delegate }
      (+ current-delegate-power delegator-balance)
    )
    
    ;; Record in history
    (map-set delegation-history
      { delegator: tx-sender, block: block-height }
      delegate
    )
    
    (ok true)
  )
)

(define-public (revoke-delegation)
  (match (get-delegate tx-sender)
    delegation
    (let
      (
        (delegate (get delegate delegation))
        (delegator-balance (unwrap! (contract-call? .governance-token get-balance tx-sender) err-not-authorized))
        (current-delegate-power (get-delegation-power delegate))
      )
      ;; Remove delegation
      (map-delete delegations { delegator: tx-sender })
      
      ;; Update delegate's power
      (map-set delegation-power
        { delegate: delegate }
        (if (>= current-delegate-power delegator-balance)
          (- current-delegate-power delegator-balance)
          u0
        )
      )
      
      ;; Record in history
      (map-set delegation-history
        { delegator: tx-sender, block: block-height }
        tx-sender
      )
      
      (ok true)
    )
    err-not-authorized
  )
)
