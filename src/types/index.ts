import { BigNumber, Signature } from 'ethers';
import { ParsedStrategyRow } from '../strategy/utils';

declare var __DEV__: boolean;

type HexType = {
  hex: string;
  type: string;
};
export enum StrategyLeafType {
  Strategy = 0,
  Collateral = 1,
  Collection = 2,
  UniV3Collateral = 3,
}

/**
 * Strategy
 *
 * Each strategy will have a `Strategy` leaf in index 0
 * to provide configuration data. Any format with `Strategy`
 * outside index 0 will be considered invalid and can result
 * in undesired behavior although the schema is uneforceable.
 */
export interface Strategy {
  /** `uint8` - Type of leaf format (`Strategy = 0`) */
  // type: StrategyLeafType.Strategy
  /** `uint8` - Version of strategy format (`0`) */
  version: number;
  /** `address` - EOA of the strategist opening the vault, cannot be reassigned */
  //strategist: string
  /** `address` - EOA that can sign new strategy roots after Vault is initiated. Role cannot be reassigned without a new transaction. New strategies can be signed without needing a transaction. */
  delegate: string;
  /** `boolean` - Indicates if a vault is public. Cannot be modified after vault opening. */
  //public?: boolean
  /** `uint256` - Date past which strategy is no longer considered valid */
  expiration: BigNumber;
  /** `uint256` - Value tracked on chain starting from 0 at the Vault opening. Incrementing the nonce on chain invalidates all lower strategies */
  nonce: BigNumber;
  /** `address` - Contract address of the vault, if the vault address is ZeroAddress then this is the first merkle tree opening the vault */
  vault: string;
}

/**
 * Lien
 *
 * `Lien` is a subtype, so the value will not be preceded with a type
 * value as it can only be nested in `Collateral` or `Collection` leaves.
 */
export interface Lien {
  /** `uint256` - Amount of $WETH in 10**18 that the borrower can borrow */
  amount: BigNumber;
  /** `uint256` - Rate of interest accrual for the lien expressed as interest per second 10**18 */
  rate: BigNumber;
  /** `uint256` - Maximum life of the lien without refinancing in epoch seconds 10**18 */
  duration: BigNumber;
  /** `uint256` - a maximum total value of all liens higher in the lien queue calculated using their rate and remaining duration. Value is `$WETH` expressed as `10**18`. A zero value indicates that the lien is in the most senior position */
  maxPotentialDebt: BigNumber;
  /** `uint256` - the value used as the starting price in the event of a liquidation dutch auction */
  liquidationInitialAsk: BigNumber;
}
export interface LienInsidePayload {
  /** `uint256` - Amount of $WETH in 10**18 that the borrower can borrow */
  amount: HexType;
  /** `uint256` - Rate of interest accrual for the lien expressed as interest per second 10**18 */
  rate: HexType;
  /** `uint256` - Maximum life of the lien without refinancing in epoch seconds 10**18 */
  duration: HexType;
  /** `uint256` - a maximum total value of all liens higher in the lien queue calculated using their rate and remaining duration. Value is `$WETH` expressed as `10**18`. A zero value indicates that the lien is in the most senior position */
  maxPotentialDebt: HexType;
  /** `uint256` - the value used as the starting price in the event of a liquidation dutch auction */
  liquidationInitialAsk: HexType;
}

/**
 * StrategyRow
 */
export interface StrategyRow {
  leaf?: string;
  /*
!The leaf is the bytes32
The SDK Produces the leaf itself so upon first init it may be empty
But when you receive it, it will never be empty
  */
  /** `uint8` - Type of leaf format */
  type: StrategyLeafType.Collateral | StrategyLeafType.Collection | StrategyLeafType.UniV3Collateral;
  /** `address` - Address of ERC721 collection */
  token: string;
  /** `uint256` - Token ID of ERC721 inside the collection */
  tokenId?: BigNumber;
  /** `address` - Address of the borrower that can commit to the lien, If the value is `address(0)` then any borrower can commit to the lien */
  borrower: string;
  /** `Lien` - Lien data */
  lien: Lien;
}

export interface StrategyRowInsidePayload {
  /** `uint8` - Type of leaf format */
  leaf?: string;
  type: StrategyLeafType.Collateral | StrategyLeafType.Collection | StrategyLeafType.UniV3Collateral;
  /** `address` - Address of ERC721 collection */
  token: string;
  /** `uint256` - Token ID of ERC721 inside the collection */
  tokenId?: HexType;
  /** `address` - Address of the borrower that can commit to the lien, If the value is `address(0)` then any borrower can commit to the lien */
  borrower: string;
  /** `Lien` - Lien data */
  lien: LienInsidePayload;
}

/**
 * Collateral
 */
export interface Collateral extends StrategyRow {
  /** `uint8` - Type of leaf format (`Collateral = 1`) */
  type: StrategyLeafType.Collateral;
  /** `uint256` - Token ID of ERC721 inside the collection */
  tokenId: BigNumber;
}

export interface CollateralInsidePayload extends StrategyRowInsidePayload {
  /** `uint8` - Type of leaf format (`Collateral = 1`) */
  type: StrategyLeafType.Collateral;
  /** `uint256` - Token ID of ERC721 inside the collection */
  tokenId: HexType;
}

/**
 * Collection
 */
export interface Collection extends StrategyRow {
  /** `uint8` - Type of leaf format (`Collection = 2`) */
  type: StrategyLeafType.Collection;
}

export interface CollectionInsidePayload extends StrategyRowInsidePayload {
  /** `uint8` - Type of leaf format (`Collection = 2`) */
  type: StrategyLeafType.Collection;
}

export interface UniV3Collateral extends StrategyRow {
  /** `uint8` - Type of leaf format (`UniV3Collateral = 3`) */
  type: StrategyLeafType.UniV3Collateral;

  /** UniV3 parameters */
  token0: string;
  token1: string;
  fee: BigNumber;
  tickLower: BigNumber;
  tickUpper: BigNumber;
  minLiquidity: BigNumber;
  amount0Min: BigNumber;
  amount1Min: BigNumber;
}

export interface UniV3CollateralInsidePayload extends StrategyRowInsidePayload {
  /** `uint8` - Type of leaf format (`UniV3Collateral = 3`) */
  type: StrategyLeafType.UniV3Collateral;

  /** UniV3 parameters */
  token0: string;
  token1: string;
  fee: HexType;
  tickLower: HexType;
  tickUpper: HexType;
  minLiquidity: HexType;
  amount0Min: HexType;
  amount1Min: HexType;
}

export interface IPFSStrategyPayload {
  typedData: any;
  signature: Signature;
  leaves: ParsedStrategyRow;
}

export interface TypedData {
  types: types;
  primaryType: string;
  domain: domain;
  message: message;
}

export interface types {
  EIP712Domain: Array<type>;
  StrategyDetails: Array<type>;
}
export interface type {
  name: string;
  type: string;
}

export interface domain {
  version: string;
  chainId: number;
  verifyingContract: string;
}

export interface message {
  nonce: string;
  deadline: string;
  root: string;
}

export interface UserSignature {
  _vs: string;
  compact: string;
  r: string;
  recoveryParam: number;
  s: string;
  v: number;
  yParityAndS: string;
  typedData: TypedData;
}

//Or should this be called S3 Object ??
export interface JsonPayload {
  data: {
    /*
    This is actually an array of leaves
    */
    //Is actually an array of types
    leaves: (CollateralInsidePayload | CollectionInsidePayload | UniV3CollateralInsidePayload)[];
    signature: Signature;
  };
}
