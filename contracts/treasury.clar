;; GovernStack DAO - Treasury Contract
;; Manages DAO treasury assets and fund distribution

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-authorized (err u101))
(define-constant err-insufficient-funds (err u102))
(define-constant err-invalid-amount (err u103))
(define-constant err-invalid-recipient (err u104))
(define-constant err-transfer-failed (err u105))
(define-constant err-proposal-not-found (err u106))

;; Data variables
(define-data-var treasury-balance uint u0)
(define-data-var payment-count uint u0)
(define-data-var min-payment-threshold uint u1000000) ;; Minimum payment amount

;; Payment status
(define-constant payment-pending u1)
(define-constant payment-approved u2)
(define-constant payment-executed u3)
(define-constant payment-rejected u4)

;; Data maps
(define-map payments
  { payment-id: uint }
  {
    recipient: principal,
    amount: uint,
    description: (string-utf8 256),
    created-by: principal,
    created-at: uint,
    status: uint,
    executed-at: (optional uint),
    proposal-id: (optional uint)
  }
)

(define-map authorized-spenders principal bool)

;; Streaming payments
(define-map payment-streams
  { stream-id: uint }
  {
    recipient: principal,
    amount-per-block: uint,
    start-block: uint,
    end-block: uint,
    claimed-amount: uint,
    is-active: bool
  }
)

(define-data-var stream-count uint u0)

;; Read-only functions
(define-read-only (get-treasury-balance)
  (ok (stx-get-balance (as-contract tx-sender)))
)

(define-read-only (get-payment (payment-id uint))
  (map-get? payments { payment-id: payment-id })
)

(define-read-only (get-payment-count)
  (var-get payment-count)
)

(define-read-only (is-authorized-spender (spender principal))
  (default-to false (map-get? authorized-spenders spender))
)

(define-read-only (get-payment-stream (stream-id uint))
  (map-get? payment-streams { stream-id: stream-id })
)

(define-read-only (calculate-claimable-amount (stream-id uint))
  (match (get-payment-stream stream-id)
    stream
    (let
      (
        (current-block block-height)
        (start (get start-block stream))
        (end (get end-block stream))
        (rate (get amount-per-block stream))
        (claimed (get claimed-amount stream))
        (active (get is-active stream))
      )
      (if active
        (let
          (
            (elapsed-blocks (if (> current-block end)
                              (- end start)
                              (- current-block start)))
            (total-available (* rate elapsed-blocks))
          )
          (ok (- total-available claimed))
        )
        (ok u0)
      )
    )
    (err err-invalid-amount)
  )
)

;; Public functions - Deposits
(define-public (deposit (amount uint))
  (begin
    (asserts! (> amount u0) err-invalid-amount)
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    (ok true)
  )
)

;; Public functions - Payments
(define-public (create-payment
  (recipient principal)
  (amount uint)
  (description (string-utf8 256))
)
  (let
    (
      (new-payment-id (+ (var-get payment-count) u1))
    )
    (asserts! (> amount u0) err-invalid-amount)
    (asserts! (not (is-eq recipient tx-sender)) err-invalid-recipient)
    
    (map-set payments
      { payment-id: new-payment-id }
      {
        recipient: recipient,
        amount: amount,
        description: description,
        created-by: tx-sender,
        created-at: block-height,
        status: payment-pending,
        executed-at: none,
        proposal-id: none
      }
    )
    
    (var-set payment-count new-payment-id)
    (ok new-payment-id)
  )
)

(define-public (execute-payment (payment-id uint))
  (let
    (
      (payment (unwrap! (get-payment payment-id) err-invalid-amount))
      (amount (get amount payment))
      (recipient (get recipient payment))
    )
    ;; Verify authorization
    (asserts! (or (is-eq tx-sender contract-owner)
                  (is-authorized-spender tx-sender))
              err-not-authorized)
    
    ;; Verify payment is pending
    (asserts! (is-eq (get status payment) payment-pending) err-not-authorized)
    
    ;; Verify sufficient funds
    (asserts! (>= (stx-get-balance (as-contract tx-sender)) amount) err-insufficient-funds)
    
    ;; Execute payment
    (try! (as-contract (stx-transfer? amount tx-sender recipient)))
    
    ;; Update payment status
    (map-set payments
      { payment-id: payment-id }
      (merge payment {
        status: payment-executed,
        executed-at: (some block-height)
      })
    )
    
    (ok true)
  )
)

(define-public (reject-payment (payment-id uint))
  (let
    (
      (payment (unwrap! (get-payment payment-id) err-invalid-amount))
    )
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (is-eq (get status payment) payment-pending) err-not-authorized)
    
    (map-set payments
      { payment-id: payment-id }
      (merge payment { status: payment-rejected })
    )
    
    (ok true)
  )
)

;; Streaming payments
(define-public (create-payment-stream
  (recipient principal)
  (amount-per-block uint)
  (duration-blocks uint)
)
  (let
    (
      (new-stream-id (+ (var-get stream-count) u1))
      (start-block (+ block-height u1))
      (end-block (+ start-block duration-blocks))
    )
    (asserts! (> amount-per-block u0) err-invalid-amount)
    (asserts! (> duration-blocks u0) err-invalid-amount)
    (asserts! (or (is-eq tx-sender contract-owner)
                  (is-authorized-spender tx-sender))
              err-not-authorized)
    
    (map-set payment-streams
      { stream-id: new-stream-id }
      {
        recipient: recipient,
        amount-per-block: amount-per-block,
        start-block: start-block,
        end-block: end-block,
        claimed-amount: u0,
        is-active: true
      }
    )
    
    (var-set stream-count new-stream-id)
    (ok new-stream-id)
  )
)

(define-public (claim-stream (stream-id uint))
  (let
    (
      (stream (unwrap! (get-payment-stream stream-id) err-invalid-amount))
      (claimable (unwrap! (calculate-claimable-amount stream-id) err-invalid-amount))
      (recipient (get recipient stream))
    )
    (asserts! (is-eq tx-sender recipient) err-not-authorized)
    (asserts! (get is-active stream) err-not-authorized)
    (asserts! (> claimable u0) err-invalid-amount)
    (asserts! (>= (stx-get-balance (as-contract tx-sender)) claimable) err-insufficient-funds)
    
    ;; Transfer funds
    (try! (as-contract (stx-transfer? claimable tx-sender recipient)))
    
    ;; Update stream
    (map-set payment-streams
      { stream-id: stream-id }
      (merge stream {
        claimed-amount: (+ (get claimed-amount stream) claimable)
      })
    )
    
    (ok claimable)
  )
)

(define-public (cancel-stream (stream-id uint))
  (let
    (
      (stream (unwrap! (get-payment-stream stream-id) err-invalid-amount))
    )
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    
    (map-set payment-streams
      { stream-id: stream-id }
      (merge stream { is-active: false })
    )
    
    (ok true)
  )
)

;; Authorization management
(define-public (add-authorized-spender (spender principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (map-set authorized-spenders spender true)
    (ok true)
  )
)

(define-public (remove-authorized-spender (spender principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (map-delete authorized-spenders spender)
    (ok true)
  )
)

;; Emergency withdrawal (owner only)
(define-public (emergency-withdraw (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (> amount u0) err-invalid-amount)
    (asserts! (>= (stx-get-balance (as-contract tx-sender)) amount) err-insufficient-funds)
    (as-contract (stx-transfer? amount tx-sender recipient))
  )
)
