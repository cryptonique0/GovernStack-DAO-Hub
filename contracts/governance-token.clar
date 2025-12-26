;; GovernStack DAO - Governance Token (SIP-010)
;; Fungible token for governance and voting

(impl-trait .sip-010-trait.sip-010-trait)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-authorized (err u101))
(define-constant err-insufficient-balance (err u102))
(define-constant err-invalid-amount (err u103))

;; Token configuration
(define-fungible-token governance-token u1000000000000000) ;; 1 billion tokens with 6 decimals

;; Data variables
(define-data-var token-name (string-ascii 32) "GovernStack Token")
(define-data-var token-symbol (string-ascii 10) "GSTK")
(define-data-var token-decimals uint u6)
(define-data-var token-uri (optional (string-utf8 256)) (some u"https://governstack.io/token-metadata.json"))

;; Data maps
(define-map balances principal uint)
(define-map allowances { owner: principal, spender: principal } uint)

;; SIP-010 functions
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (or (is-eq tx-sender sender) (is-eq contract-caller sender)) err-not-authorized)
    (asserts! (>= (ft-get-balance governance-token sender) amount) err-insufficient-balance)
    (try! (ft-transfer? governance-token amount sender recipient))
    (match memo to-print (print to-print) 0x)
    (ok true)
  )
)

(define-read-only (get-name)
  (ok (var-get token-name))
)

(define-read-only (get-symbol)
  (ok (var-get token-symbol))
)

(define-read-only (get-decimals)
  (ok (var-get token-decimals))
)

(define-read-only (get-balance (account principal))
  (ok (ft-get-balance governance-token account))
)

(define-read-only (get-total-supply)
  (ok (ft-get-supply governance-token))
)

(define-read-only (get-token-uri)
  (ok (var-get token-uri))
)

;; Additional governance functions
(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (> amount u0) err-invalid-amount)
    (ft-mint? governance-token amount recipient)
  )
)

(define-public (burn (amount uint))
  (begin
    (asserts! (>= (ft-get-balance governance-token tx-sender) amount) err-insufficient-balance)
    (asserts! (> amount u0) err-invalid-amount)
    (ft-burn? governance-token amount tx-sender)
  )
)

(define-public (approve (spender principal) (amount uint))
  (begin
    (map-set allowances { owner: tx-sender, spender: spender } amount)
    (ok true)
  )
)

(define-public (transfer-from (amount uint) (owner principal) (recipient principal))
  (let
    (
      (allowance (default-to u0 (map-get? allowances { owner: owner, spender: tx-sender })))
    )
    (asserts! (>= allowance amount) err-not-authorized)
    (asserts! (>= (ft-get-balance governance-token owner) amount) err-insufficient-balance)
    (try! (ft-transfer? governance-token amount owner recipient))
    (map-set allowances { owner: owner, spender: tx-sender } (- allowance amount))
    (ok true)
  )
)

(define-read-only (get-allowance (owner principal) (spender principal))
  (ok (default-to u0 (map-get? allowances { owner: owner, spender: spender })))
)

;; Snapshot for voting power
(define-map balance-snapshots 
  { account: principal, block: uint } 
  uint
)

(define-public (snapshot-balance (account principal))
  (let
    (
      (balance (ft-get-balance governance-token account))
    )
    (map-set balance-snapshots { account: account, block: block-height } balance)
    (ok balance)
  )
)

(define-read-only (get-balance-at (account principal) (block uint))
  (default-to u0 (map-get? balance-snapshots { account: account, block: block }))
)

;; Initialize with initial supply
(begin
  (try! (ft-mint? governance-token u1000000000000000 contract-owner))
)
