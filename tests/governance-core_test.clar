;; GovernStack DAO - Test Suite for Governance Core
(define-constant deployer tx-sender)
(define-constant wallet-1 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)
(define-constant wallet-2 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5)
(define-constant wallet-3 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG)

;; Test: Create proposal with sufficient tokens
(define-public (test-create-proposal-success)
  (let
    (
      (proposal-id (unwrap! (contract-call? .governance-core create-proposal
        "Test Proposal"
        u"This is a test proposal for governance"
        .governance-core
        "test-function"
        (list)
      ) (err u1)))
    )
    (asserts! (> proposal-id u0) (err u2))
    (ok proposal-id)
  )
)

;; Test: Vote on active proposal
(define-public (test-cast-vote)
  (let
    (
      (proposal-id u1)
    )
    (try! (contract-call? .governance-core cast-vote proposal-id u1))
    (ok true)
  )
)

;; Test: Queue successful proposal
(define-public (test-queue-proposal)
  (let
    (
      (proposal-id u1)
    )
    (try! (contract-call? .governance-core queue-proposal proposal-id))
    (ok true)
  )
)
