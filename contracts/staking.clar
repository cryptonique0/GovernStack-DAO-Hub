;; GovernStack DAO - Staking Contract
;; Allows users to stake governance tokens for rewards and voting power

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-authorized (err u101))
(define-constant err-insufficient-balance (err u102))
(define-constant err-invalid-amount (err u103))
(define-constant err-no-stake (err u104))
(define-constant err-lock-period-active (err u105))

;; Data variables
(define-data-var total-staked uint u0)
(define-data-var reward-rate uint u100) ;; 1% per 1000 blocks
(define-data-var min-stake-amount uint u1000000) ;; 1 token minimum
(define-data-var lock-period uint u1440) ;; ~10 days lock period

;; Lock duration multipliers (for vote escrow)
(define-constant lock-1-month u4320)  ;; ~30 days, 1x multiplier
(define-constant lock-3-months u12960) ;; ~90 days, 1.5x multiplier
(define-constant lock-6-months u25920) ;; ~180 days, 2x multiplier
(define-constant lock-12-months u51840) ;; ~360 days, 3x multiplier

;; Data maps
(define-map stakes
  { staker: principal }
  {
    amount: uint,
    staked-at: uint,
    lock-until: uint,
    reward-debt: uint,
    lock-multiplier: uint
  }
)

(define-map rewards-claimed
  { staker: principal }
  uint
)

;; Read-only functions
(define-read-only (get-stake (staker principal))
  (map-get? stakes { staker: staker })
)

(define-read-only (get-total-staked)
  (var-get total-staked)
)

(define-read-only (get-reward-rate)
  (var-get reward-rate)
)

(define-read-only (calculate-rewards (staker principal))
  (match (get-stake staker)
    stake
    (let
      (
        (amount (get amount stake))
        (staked-at (get staked-at stake))
        (blocks-staked (- block-height staked-at))
        (reward-debt (get reward-debt stake))
        (multiplier (get lock-multiplier stake))
      )
      (ok (- (* (* amount blocks-staked multiplier) (var-get reward-rate)) reward-debt))
    )
    (ok u0)
  )
)

(define-read-only (get-voting-power (staker principal))
  (match (get-stake staker)
    stake
    (let
      (
        (amount (get amount stake))
        (multiplier (get lock-multiplier stake))
      )
      (ok (* amount multiplier))
    )
    (ok u0)
  )
)

;; Public functions
(define-public (stake (amount uint) (lock-duration uint))
  (let
    (
      (multiplier (get-lock-multiplier lock-duration))
      (lock-until (+ block-height lock-duration))
    )
    (asserts! (>= amount (var-get min-stake-amount)) err-invalid-amount)
    
    ;; Transfer tokens to contract
    (try! (contract-call? .governance-token transfer amount tx-sender (as-contract tx-sender) none))
    
    ;; Update stake
    (match (get-stake tx-sender)
      existing-stake
      (let
        (
          (current-amount (get amount existing-stake))
          (new-amount (+ current-amount amount))
        )
        (map-set stakes
          { staker: tx-sender }
          (merge existing-stake {
            amount: new-amount,
            lock-until: lock-until,
            lock-multiplier: multiplier
          })
        )
      )
      (map-set stakes
        { staker: tx-sender }
        {
          amount: amount,
          staked-at: block-height,
          lock-until: lock-until,
          reward-debt: u0,
          lock-multiplier: multiplier
        }
      )
    )
    
    ;; Update total staked
    (var-set total-staked (+ (var-get total-staked) amount))
    
    (ok true)
  )
)

(define-public (unstake (amount uint))
  (let
    (
      (stake (unwrap! (get-stake tx-sender) err-no-stake))
      (staked-amount (get amount stake))
      (lock-until (get lock-until stake))
    )
    (asserts! (> staked-amount u0) err-no-stake)
    (asserts! (>= staked-amount amount) err-insufficient-balance)
    (asserts! (>= block-height lock-until) err-lock-period-active)
    
    ;; Calculate and claim rewards first
    (try! (claim-rewards))
    
    ;; Transfer tokens back to staker
    (try! (as-contract (contract-call? .governance-token transfer amount tx-sender tx-sender none)))
    
    ;; Update stake
    (let
      (
        (new-amount (- staked-amount amount))
      )
      (if (is-eq new-amount u0)
        (map-delete stakes { staker: tx-sender })
        (map-set stakes
          { staker: tx-sender }
          (merge stake { amount: new-amount })
        )
      )
    )
    
    ;; Update total staked
    (var-set total-staked (- (var-get total-staked) amount))
    
    (ok true)
  )
)

(define-public (claim-rewards)
  (let
    (
      (rewards (unwrap! (calculate-rewards tx-sender) err-no-stake))
      (stake (unwrap! (get-stake tx-sender) err-no-stake))
    )
    (asserts! (> rewards u0) err-invalid-amount)
    
    ;; Mint reward tokens
    (try! (contract-call? .governance-token mint rewards tx-sender))
    
    ;; Update reward debt
    (map-set stakes
      { staker: tx-sender }
      (merge stake {
        reward-debt: (+ (get reward-debt stake) rewards)
      })
    )
    
    ;; Track claimed rewards
    (map-set rewards-claimed
      { staker: tx-sender }
      (+ (default-to u0 (map-get? rewards-claimed { staker: tx-sender })) rewards)
    )
    
    (ok rewards)
  )
)

;; Helper function
(define-private (get-lock-multiplier (duration uint))
  (if (>= duration lock-12-months)
    u3
    (if (>= duration lock-6-months)
      u2
      (if (>= duration lock-3-months)
        u15 ;; 1.5x (using u15 to represent 1.5 in fixed point)
        u10 ;; 1x (using u10 to represent 1.0 in fixed point)
      )
    )
  )
)

;; Admin functions
(define-public (set-reward-rate (new-rate uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set reward-rate new-rate)
    (ok true)
  )
)

(define-public (set-min-stake-amount (new-amount uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (> new-amount u0) err-invalid-amount)
    (var-set min-stake-amount new-amount)
    (ok true)
  )
)
