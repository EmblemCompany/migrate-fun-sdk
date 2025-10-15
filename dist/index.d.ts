import { N as Network, I as IdlSource, L as LoadedProject, B as BalanceSnapshot, S as SdkError } from './types-B_E0RrC2.js';
export { M as MigrationPhase, a as SdkErrorCode, i as isSdkError } from './types-B_E0RrC2.js';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { PublicKey, Connection, Transaction } from '@solana/web3.js';

var address$1 = "migK824DsBMp2eZXdhSBAWFS6PbvA6UN8DV15HfmstR";
var metadata$1 = {
	name: "hustle_migration",
	version: "0.1.0",
	spec: "0.1.0",
	description: "Created with Anchor"
};
var instructions$1 = [
	{
		name: "accept_platform_admin",
		discriminator: [
			138,
			66,
			59,
			92,
			174,
			222,
			99,
			82
		],
		accounts: [
			{
				name: "nominee",
				writable: true,
				signer: true
			},
			{
				name: "platform_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								108,
								97,
								116,
								102,
								111,
								114,
								109,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						}
					]
				}
			},
			{
				name: "candidate",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								108,
								97,
								116,
								102,
								111,
								114,
								109,
								95,
								97,
								100,
								109,
								105,
								110,
								95,
								99,
								97,
								110,
								100,
								105,
								100,
								97,
								116,
								101
							]
						}
					]
				}
			}
		],
		args: [
		]
	},
	{
		name: "burn_lp_portion",
		discriminator: [
			79,
			149,
			82,
			188,
			51,
			208,
			169,
			210
		],
		accounts: [
			{
				name: "project_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "pool_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								111,
								111,
								108,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "lp_vault",
				docs: [
					"LP token vault that holds the tokens to burn"
				],
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								108,
								112,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "lp_mint",
				docs: [
					"LP token mint"
				],
				writable: true
			},
			{
				name: "admin",
				writable: true,
				signer: true,
				relations: [
					"project_config"
				]
			},
			{
				name: "token_program",
				address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			}
		]
	},
	{
		name: "cancel_platform_admin_proposal",
		discriminator: [
			33,
			29,
			16,
			173,
			148,
			158,
			171,
			232
		],
		accounts: [
			{
				name: "admin",
				writable: true,
				signer: true
			},
			{
				name: "platform_config",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								108,
								97,
								116,
								102,
								111,
								114,
								109,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						}
					]
				}
			},
			{
				name: "candidate",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								108,
								97,
								116,
								102,
								111,
								114,
								109,
								95,
								97,
								100,
								109,
								105,
								110,
								95,
								99,
								97,
								110,
								100,
								105,
								100,
								97,
								116,
								101
							]
						}
					]
				}
			}
		],
		args: [
		]
	},
	{
		name: "claim_fees",
		discriminator: [
			82,
			251,
			233,
			156,
			12,
			52,
			184,
			202
		],
		accounts: [
			{
				name: "platform_admin",
				writable: true,
				signer: true
			},
			{
				name: "platform_config",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								108,
								97,
								116,
								102,
								111,
								114,
								109,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						}
					]
				}
			},
			{
				name: "platform_fee_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "platform_config"
						},
						{
							kind: "const",
							value: [
								6,
								221,
								246,
								225,
								215,
								101,
								161,
								147,
								217,
								203,
								225,
								70,
								206,
								235,
								121,
								172,
								28,
								180,
								133,
								237,
								95,
								91,
								55,
								145,
								58,
								140,
								245,
								133,
								126,
								255,
								0,
								169
							]
						},
						{
							kind: "account",
							path: "token_mint"
						}
					],
					program: {
						kind: "const",
						value: [
							140,
							151,
							37,
							143,
							78,
							36,
							137,
							241,
							187,
							61,
							16,
							41,
							20,
							142,
							13,
							131,
							11,
							90,
							19,
							153,
							218,
							255,
							16,
							132,
							4,
							142,
							123,
							216,
							219,
							233,
							248,
							89
						]
					}
				}
			},
			{
				name: "treasury"
			},
			{
				name: "treasury_token_ata",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "treasury"
						},
						{
							kind: "const",
							value: [
								6,
								221,
								246,
								225,
								215,
								101,
								161,
								147,
								217,
								203,
								225,
								70,
								206,
								235,
								121,
								172,
								28,
								180,
								133,
								237,
								95,
								91,
								55,
								145,
								58,
								140,
								245,
								133,
								126,
								255,
								0,
								169
							]
						},
						{
							kind: "account",
							path: "token_mint"
						}
					],
					program: {
						kind: "const",
						value: [
							140,
							151,
							37,
							143,
							78,
							36,
							137,
							241,
							187,
							61,
							16,
							41,
							20,
							142,
							13,
							131,
							11,
							90,
							19,
							153,
							218,
							255,
							16,
							132,
							4,
							142,
							123,
							216,
							219,
							233,
							248,
							89
						]
					}
				}
			},
			{
				name: "token_mint"
			},
			{
				name: "token_program",
				address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
			},
			{
				name: "associated_token_program",
				address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			}
		],
		args: [
		]
	},
	{
		name: "claim_refund",
		discriminator: [
			15,
			16,
			30,
			161,
			255,
			228,
			97,
			60
		],
		accounts: [
			{
				name: "user",
				writable: true,
				signer: true
			},
			{
				name: "project_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "user_migration",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								117,
								115,
								101,
								114,
								95,
								109,
								105,
								103,
								114,
								97,
								116,
								105,
								111,
								110
							]
						},
						{
							kind: "arg",
							path: "project_id"
						},
						{
							kind: "account",
							path: "user"
						}
					]
				}
			},
			{
				name: "quote_token_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								113,
								117,
								111,
								116,
								101,
								95,
								116,
								111,
								107,
								101,
								110,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "user_quote_token_ata",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "user"
						},
						{
							kind: "account",
							path: "quote_token_program"
						},
						{
							kind: "account",
							path: "quote_token_mint"
						}
					],
					program: {
						kind: "const",
						value: [
							140,
							151,
							37,
							143,
							78,
							36,
							137,
							241,
							187,
							61,
							16,
							41,
							20,
							142,
							13,
							131,
							11,
							90,
							19,
							153,
							218,
							255,
							16,
							132,
							4,
							142,
							123,
							216,
							219,
							233,
							248,
							89
						]
					}
				}
			},
			{
				name: "quote_token_mint"
			},
			{
				name: "mft_mint",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								109,
								102,
								116,
								95,
								109,
								105,
								110,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "user_mft_ata",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "user"
						},
						{
							kind: "account",
							path: "token_program"
						},
						{
							kind: "account",
							path: "mft_mint"
						}
					],
					program: {
						kind: "const",
						value: [
							140,
							151,
							37,
							143,
							78,
							36,
							137,
							241,
							187,
							61,
							16,
							41,
							20,
							142,
							13,
							131,
							11,
							90,
							19,
							153,
							218,
							255,
							16,
							132,
							4,
							142,
							123,
							216,
							219,
							233,
							248,
							89
						]
					}
				}
			},
			{
				name: "token_program",
				address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
			},
			{
				name: "quote_token_program"
			},
			{
				name: "associated_token_program",
				address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			}
		]
	},
	{
		name: "claim_with_merkle",
		discriminator: [
			42,
			70,
			30,
			26,
			71,
			71,
			164,
			16
		],
		accounts: [
			{
				name: "user",
				writable: true,
				signer: true
			},
			{
				name: "config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "user_claim",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								117,
								115,
								101,
								114,
								95,
								109,
								101,
								114,
								107,
								108,
								101,
								95,
								99,
								108,
								97,
								105,
								109
							]
						},
						{
							kind: "account",
							path: "user"
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "old_token_vault",
				writable: true
			},
			{
				name: "user_old_token_ata",
				writable: true
			},
			{
				name: "new_token_vault",
				writable: true
			},
			{
				name: "user_new_token_ata",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "user"
						},
						{
							kind: "account",
							path: "new_token_program"
						},
						{
							kind: "account",
							path: "new_token_mint"
						}
					],
					program: {
						kind: "const",
						value: [
							140,
							151,
							37,
							143,
							78,
							36,
							137,
							241,
							187,
							61,
							16,
							41,
							20,
							142,
							13,
							131,
							11,
							90,
							19,
							153,
							218,
							255,
							16,
							132,
							4,
							142,
							123,
							216,
							219,
							233,
							248,
							89
						]
					}
				}
			},
			{
				name: "new_token_mint"
			},
			{
				name: "old_token_mint"
			},
			{
				name: "old_token_program"
			},
			{
				name: "new_token_program"
			},
			{
				name: "associated_token_program",
				address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			},
			{
				name: "amount",
				type: "u64"
			},
			{
				name: "proof",
				type: {
					vec: {
						array: [
							"u8",
							32
						]
					}
				}
			}
		]
	},
	{
		name: "claim_with_mft",
		discriminator: [
			232,
			162,
			178,
			244,
			170,
			169,
			199,
			205
		],
		accounts: [
			{
				name: "user",
				writable: true,
				signer: true
			},
			{
				name: "project_config",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "user_mft_ata",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "user"
						},
						{
							kind: "account",
							path: "token_program"
						},
						{
							kind: "account",
							path: "mft_mint"
						}
					],
					program: {
						kind: "const",
						value: [
							140,
							151,
							37,
							143,
							78,
							36,
							137,
							241,
							187,
							61,
							16,
							41,
							20,
							142,
							13,
							131,
							11,
							90,
							19,
							153,
							218,
							255,
							16,
							132,
							4,
							142,
							123,
							216,
							219,
							233,
							248,
							89
						]
					}
				}
			},
			{
				name: "user_new_token_ata",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "user"
						},
						{
							kind: "account",
							path: "new_token_program"
						},
						{
							kind: "account",
							path: "new_token_mint"
						}
					],
					program: {
						kind: "const",
						value: [
							140,
							151,
							37,
							143,
							78,
							36,
							137,
							241,
							187,
							61,
							16,
							41,
							20,
							142,
							13,
							131,
							11,
							90,
							19,
							153,
							218,
							255,
							16,
							132,
							4,
							142,
							123,
							216,
							219,
							233,
							248,
							89
						]
					}
				}
			},
			{
				name: "new_token_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								110,
								101,
								119,
								95,
								116,
								111,
								107,
								101,
								110,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "mft_mint",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								109,
								102,
								116,
								95,
								109,
								105,
								110,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "new_token_mint"
			},
			{
				name: "new_token_program"
			},
			{
				name: "token_program",
				address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
			},
			{
				name: "associated_token_program",
				address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			},
			{
				name: "amount",
				type: "u64"
			}
		]
	},
	{
		name: "create_pool",
		discriminator: [
			233,
			146,
			209,
			142,
			207,
			104,
			64,
			188
		],
		accounts: [
			{
				name: "admin",
				writable: true,
				signer: true
			},
			{
				name: "project_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "pool_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								111,
								111,
								108,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "quote_token_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								113,
								117,
								111,
								116,
								101,
								95,
								116,
								111,
								107,
								101,
								110,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "new_token_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								110,
								101,
								119,
								95,
								116,
								111,
								107,
								101,
								110,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "lp_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								108,
								112,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "admin_quote_token_ata",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "admin"
						},
						{
							kind: "account",
							path: "token_program"
						},
						{
							kind: "account",
							path: "quote_token_mint"
						}
					],
					program: {
						kind: "const",
						value: [
							140,
							151,
							37,
							143,
							78,
							36,
							137,
							241,
							187,
							61,
							16,
							41,
							20,
							142,
							13,
							131,
							11,
							90,
							19,
							153,
							218,
							255,
							16,
							132,
							4,
							142,
							123,
							216,
							219,
							233,
							248,
							89
						]
					}
				}
			},
			{
				name: "admin_new_token_ata",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "admin"
						},
						{
							kind: "account",
							path: "new_token_program"
						},
						{
							kind: "account",
							path: "new_token_mint"
						}
					],
					program: {
						kind: "const",
						value: [
							140,
							151,
							37,
							143,
							78,
							36,
							137,
							241,
							187,
							61,
							16,
							41,
							20,
							142,
							13,
							131,
							11,
							90,
							19,
							153,
							218,
							255,
							16,
							132,
							4,
							142,
							123,
							216,
							219,
							233,
							248,
							89
						]
					}
				}
			},
			{
				name: "admin_lp_ata",
				writable: true
			},
			{
				name: "quote_token_mint"
			},
			{
				name: "new_token_mint"
			},
			{
				name: "cpmm_program"
			},
			{
				name: "amm_config"
			},
			{
				name: "raydium_authority",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								118,
								97,
								117,
								108,
								116,
								95,
								97,
								110,
								100,
								95,
								108,
								112,
								95,
								109,
								105,
								110,
								116,
								95,
								97,
								117,
								116,
								104,
								95,
								115,
								101,
								101,
								100
							]
						}
					],
					program: {
						kind: "account",
						path: "cpmm_program"
					}
				}
			},
			{
				name: "raydium_pool_state",
				docs: [
					"Raydium validates this internally during initialization"
				],
				writable: true
			},
			{
				name: "raydium_lp_mint",
				writable: true
			},
			{
				name: "raydium_token_0_vault",
				writable: true
			},
			{
				name: "raydium_token_1_vault",
				writable: true
			},
			{
				name: "raydium_observation_state",
				writable: true
			},
			{
				name: "create_pool_fee",
				writable: true,
				address: "G11FKBRaAkHAKuLCgLM6K6NUc9rTjPAznRCjZifrTQe2"
			},
			{
				name: "mft_mint",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								109,
								102,
								116,
								95,
								109,
								105,
								110,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "token_program",
				address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
			},
			{
				name: "new_token_program"
			},
			{
				name: "associated_token_program",
				address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			},
			{
				name: "rent",
				address: "SysvarRent111111111111111111111111111111111"
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			},
			{
				name: "init_amount_0",
				type: "u64"
			},
			{
				name: "init_amount_1",
				type: "u64"
			}
		]
	},
	{
		name: "create_project",
		discriminator: [
			148,
			219,
			181,
			42,
			221,
			114,
			145,
			190
		],
		accounts: [
			{
				name: "admin",
				writable: true,
				signer: true
			},
			{
				name: "project_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "platform_config",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								108,
								97,
								116,
								102,
								111,
								114,
								109,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						}
					]
				}
			},
			{
				name: "platform_treasury",
				writable: true
			},
			{
				name: "old_token_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								111,
								108,
								100,
								95,
								116,
								111,
								107,
								101,
								110,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "new_token_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								110,
								101,
								119,
								95,
								116,
								111,
								107,
								101,
								110,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "quote_token_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								113,
								117,
								111,
								116,
								101,
								95,
								116,
								111,
								107,
								101,
								110,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "lp_vault",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								108,
								112,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "mft_mint",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								109,
								102,
								116,
								95,
								109,
								105,
								110,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "old_token_mint"
			},
			{
				name: "new_token_mint"
			},
			{
				name: "quote_token_mint"
			},
			{
				name: "source_pool_id"
			},
			{
				name: "source_pool_program"
			},
			{
				name: "old_token_program"
			},
			{
				name: "new_token_program"
			},
			{
				name: "quote_token_program"
			},
			{
				name: "associated_token_program",
				address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			},
			{
				name: "params",
				type: {
					defined: {
						name: "CreateProjectParams"
					}
				}
			}
		]
	},
	{
		name: "create_pumpfun_token",
		discriminator: [
			32,
			217,
			77,
			209,
			89,
			36,
			65,
			35
		],
		accounts: [
			{
				name: "admin",
				writable: true,
				signer: true
			},
			{
				name: "project_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "quote_token_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								113,
								117,
								111,
								116,
								101,
								95,
								116,
								111,
								107,
								101,
								110,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "quote_token_mint",
				address: "So11111111111111111111111111111111111111112"
			},
			{
				name: "admin_wsol_ata",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "admin"
						},
						{
							kind: "const",
							value: [
								6,
								221,
								246,
								225,
								215,
								101,
								161,
								147,
								217,
								203,
								225,
								70,
								206,
								235,
								121,
								172,
								28,
								180,
								133,
								237,
								95,
								91,
								55,
								145,
								58,
								140,
								245,
								133,
								126,
								255,
								0,
								169
							]
						},
						{
							kind: "account",
							path: "quote_token_mint"
						}
					],
					program: {
						kind: "const",
						value: [
							140,
							151,
							37,
							143,
							78,
							36,
							137,
							241,
							187,
							61,
							16,
							41,
							20,
							142,
							13,
							131,
							11,
							90,
							19,
							153,
							218,
							255,
							16,
							132,
							4,
							142,
							123,
							216,
							219,
							233,
							248,
							89
						]
					}
				}
			},
			{
				name: "new_mint",
				writable: true,
				signer: true
			},
			{
				name: "pumpfun_program",
				address: "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"
			},
			{
				name: "pumpfun_mint_authority"
			},
			{
				name: "bonding_curve",
				writable: true
			},
			{
				name: "bonding_curve_token_account",
				writable: true
			},
			{
				name: "pumpfun_global"
			},
			{
				name: "metadata",
				writable: true
			},
			{
				name: "event_authority",
				address: "Ce6TQqeHC9p8KetsN6JsjHK7UTZk7nasjjnr7XxXp9F1"
			},
			{
				name: "mpl_token_metadata",
				address: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
			},
			{
				name: "token_program",
				address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
			},
			{
				name: "associated_token_program",
				address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			},
			{
				name: "rent",
				address: "SysvarRent111111111111111111111111111111111"
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			},
			{
				name: "token_name",
				type: "string"
			},
			{
				name: "token_symbol",
				type: "string"
			},
			{
				name: "metadata_uri",
				type: "string"
			}
		]
	},
	{
		name: "deposit_new_tokens",
		discriminator: [
			140,
			243,
			212,
			140,
			193,
			80,
			18,
			93
		],
		accounts: [
			{
				name: "admin",
				writable: true,
				signer: true
			},
			{
				name: "project_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "admin_new_token_ata",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "admin"
						},
						{
							kind: "account",
							path: "new_token_program"
						},
						{
							kind: "account",
							path: "new_token_mint"
						}
					],
					program: {
						kind: "const",
						value: [
							140,
							151,
							37,
							143,
							78,
							36,
							137,
							241,
							187,
							61,
							16,
							41,
							20,
							142,
							13,
							131,
							11,
							90,
							19,
							153,
							218,
							255,
							16,
							132,
							4,
							142,
							123,
							216,
							219,
							233,
							248,
							89
						]
					}
				}
			},
			{
				name: "new_token_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								110,
								101,
								119,
								95,
								116,
								111,
								107,
								101,
								110,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "new_token_mint"
			},
			{
				name: "new_token_program"
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			},
			{
				name: "amount",
				type: "u64"
			}
		]
	},
	{
		name: "emergency_withdraw",
		discriminator: [
			239,
			45,
			203,
			64,
			150,
			73,
			218,
			92
		],
		accounts: [
			{
				name: "admin",
				writable: true,
				signer: true
			},
			{
				name: "project_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "old_token_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								111,
								108,
								100,
								95,
								116,
								111,
								107,
								101,
								110,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "new_token_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								110,
								101,
								119,
								95,
								116,
								111,
								107,
								101,
								110,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "wsol_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								113,
								117,
								111,
								116,
								101,
								95,
								116,
								111,
								107,
								101,
								110,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "admin_token_account",
				writable: true
			},
			{
				name: "old_token_mint",
				optional: true
			},
			{
				name: "new_token_mint",
				optional: true
			},
			{
				name: "wsol_mint",
				optional: true
			},
			{
				name: "token_program"
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			},
			{
				name: "token_type",
				type: "u8"
			}
		]
	},
	{
		name: "enable_claims",
		discriminator: [
			56,
			47,
			60,
			155,
			110,
			73,
			10,
			82
		],
		accounts: [
			{
				name: "admin",
				writable: true,
				signer: true
			},
			{
				name: "config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			}
		]
	},
	{
		name: "finalize_swap",
		discriminator: [
			148,
			202,
			88,
			125,
			45,
			237,
			53,
			217
		],
		accounts: [
			{
				name: "admin",
				writable: true,
				signer: true
			},
			{
				name: "project_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "old_token_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								111,
								108,
								100,
								95,
								116,
								111,
								107,
								101,
								110,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "quote_token_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								113,
								117,
								111,
								116,
								101,
								95,
								116,
								111,
								107,
								101,
								110,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "platform_config",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								108,
								97,
								116,
								102,
								111,
								114,
								109,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						}
					]
				}
			},
			{
				name: "platform_fee_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "platform_config"
						},
						{
							kind: "const",
							value: [
								6,
								221,
								246,
								225,
								215,
								101,
								161,
								147,
								217,
								203,
								225,
								70,
								206,
								235,
								121,
								172,
								28,
								180,
								133,
								237,
								95,
								91,
								55,
								145,
								58,
								140,
								245,
								133,
								126,
								255,
								0,
								169
							]
						},
						{
							kind: "account",
							path: "quote_token_mint"
						}
					],
					program: {
						kind: "const",
						value: [
							140,
							151,
							37,
							143,
							78,
							36,
							137,
							241,
							187,
							61,
							16,
							41,
							20,
							142,
							13,
							131,
							11,
							90,
							19,
							153,
							218,
							255,
							16,
							132,
							4,
							142,
							123,
							216,
							219,
							233,
							248,
							89
						]
					}
				}
			},
			{
				name: "quote_token_mint"
			},
			{
				name: "old_token_mint"
			},
			{
				name: "old_token_program"
			},
			{
				name: "quote_token_program"
			},
			{
				name: "token_program",
				address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
			},
			{
				name: "associated_token_program",
				address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			},
			{
				name: "minimum_amount_out",
				type: "u64"
			},
			{
				name: "swap_percentage",
				type: {
					option: "u8"
				}
			}
		]
	},
	{
		name: "initialize_platform",
		discriminator: [
			119,
			201,
			101,
			45,
			75,
			122,
			89,
			3
		],
		accounts: [
			{
				name: "admin",
				writable: true,
				signer: true
			},
			{
				name: "platform_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								108,
								97,
								116,
								102,
								111,
								114,
								109,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						}
					]
				}
			},
			{
				name: "treasury",
				writable: true
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			}
		],
		args: [
			{
				name: "default_fee_basis_points",
				type: "u16"
			},
			{
				name: "project_creation_fee",
				type: "u64"
			}
		]
	},
	{
		name: "initialize_project",
		discriminator: [
			69,
			126,
			215,
			37,
			20,
			60,
			73,
			235
		],
		accounts: [
			{
				name: "admin",
				writable: true,
				signer: true
			},
			{
				name: "project_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "old_token_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								111,
								108,
								100,
								95,
								116,
								111,
								107,
								101,
								110,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "quote_token_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								113,
								117,
								111,
								116,
								101,
								95,
								116,
								111,
								107,
								101,
								110,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "mft_mint",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								109,
								102,
								116,
								95,
								109,
								105,
								110,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "metadata_account",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								109,
								101,
								116,
								97,
								100,
								97,
								116,
								97
							]
						},
						{
							kind: "account",
							path: "token_metadata_program"
						},
						{
							kind: "account",
							path: "mft_mint"
						}
					],
					program: {
						kind: "account",
						path: "token_metadata_program"
					}
				}
			},
			{
				name: "old_token_mint"
			},
			{
				name: "quote_token_mint"
			},
			{
				name: "old_token_program"
			},
			{
				name: "quote_token_program"
			},
			{
				name: "token_program",
				address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
			},
			{
				name: "associated_token_program",
				address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
			},
			{
				name: "token_metadata_program",
				address: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			},
			{
				name: "rent",
				address: "SysvarRent111111111111111111111111111111111"
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			}
		]
	},
	{
		name: "lock_admin_portion",
		discriminator: [
			3,
			178,
			114,
			147,
			42,
			176,
			61,
			41
		],
		accounts: [
			{
				name: "admin",
				writable: true,
				signer: true
			},
			{
				name: "project_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "pool_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								111,
								111,
								108,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "locking_program",
				address: "DLockwT7X7sxtLmGH9g5kmfcjaBtncdbUmi738m5bvQC"
			},
			{
				name: "admin_fee_nft_mint",
				writable: true,
				signer: true
			},
			{
				name: "token_program",
				address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
			},
			{
				name: "associated_token_program",
				address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
			},
			{
				name: "metadata_program",
				address: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			},
			{
				name: "rent",
				address: "SysvarRent111111111111111111111111111111111"
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			}
		]
	},
	{
		name: "lock_bonk_fun_portion",
		discriminator: [
			227,
			184,
			213,
			217,
			1,
			53,
			5,
			222
		],
		accounts: [
			{
				name: "admin",
				writable: true,
				signer: true
			},
			{
				name: "project_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "pool_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								111,
								111,
								108,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "locking_program",
				address: "DLockwT7X7sxtLmGH9g5kmfcjaBtncdbUmi738m5bvQC"
			},
			{
				name: "bonk_fun_fee_nft_mint",
				writable: true,
				signer: true
			},
			{
				name: "token_program",
				address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
			},
			{
				name: "associated_token_program",
				address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
			},
			{
				name: "metadata_program",
				address: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			},
			{
				name: "rent",
				address: "SysvarRent111111111111111111111111111111111"
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			}
		]
	},
	{
		name: "lock_lp_from_vault",
		discriminator: [
			18,
			185,
			26,
			145,
			206,
			63,
			88,
			11
		],
		accounts: [
			{
				name: "admin",
				writable: true,
				signer: true
			},
			{
				name: "project_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "pool_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								111,
								111,
								108,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "lp_mint"
			},
			{
				name: "lp_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								108,
								112,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "admin_lp_ata",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "admin"
						},
						{
							kind: "const",
							value: [
								6,
								221,
								246,
								225,
								215,
								101,
								161,
								147,
								217,
								203,
								225,
								70,
								206,
								235,
								121,
								172,
								28,
								180,
								133,
								237,
								95,
								91,
								55,
								145,
								58,
								140,
								245,
								133,
								126,
								255,
								0,
								169
							]
						},
						{
							kind: "account",
							path: "lp_mint"
						}
					],
					program: {
						kind: "const",
						value: [
							140,
							151,
							37,
							143,
							78,
							36,
							137,
							241,
							187,
							61,
							16,
							41,
							20,
							142,
							13,
							131,
							11,
							90,
							19,
							153,
							218,
							255,
							16,
							132,
							4,
							142,
							123,
							216,
							219,
							233,
							248,
							89
						]
					}
				}
			},
			{
				name: "streamflow_program"
			},
			{
				name: "streamflow_metadata",
				docs: [
					"Must be a signer - StreamFlow requires this to be a fresh keypair"
				],
				writable: true,
				signer: true
			},
			{
				name: "streamflow_escrow",
				writable: true
			},
			{
				name: "streamflow_treasury",
				writable: true
			},
			{
				name: "streamflow_treasury_tokens",
				writable: true
			},
			{
				name: "streamflow_fee_oracle"
			},
			{
				name: "streamflow_withdrawor",
				writable: true
			},
			{
				name: "token_program",
				address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
			},
			{
				name: "associated_token_program",
				address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			},
			{
				name: "rent",
				address: "SysvarRent111111111111111111111111111111111"
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			}
		]
	},
	{
		name: "mark_token_created",
		discriminator: [
			222,
			248,
			124,
			133,
			151,
			167,
			195,
			234
		],
		accounts: [
			{
				name: "admin",
				writable: true,
				signer: true,
				relations: [
					"project_config"
				]
			},
			{
				name: "project_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			}
		]
	},
	{
		name: "migrate",
		discriminator: [
			155,
			234,
			231,
			146,
			236,
			158,
			162,
			30
		],
		accounts: [
			{
				name: "user",
				writable: true,
				signer: true
			},
			{
				name: "project_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "user_old_token_ata",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "user"
						},
						{
							kind: "account",
							path: "old_token_program"
						},
						{
							kind: "account",
							path: "old_token_mint"
						}
					],
					program: {
						kind: "const",
						value: [
							140,
							151,
							37,
							143,
							78,
							36,
							137,
							241,
							187,
							61,
							16,
							41,
							20,
							142,
							13,
							131,
							11,
							90,
							19,
							153,
							218,
							255,
							16,
							132,
							4,
							142,
							123,
							216,
							219,
							233,
							248,
							89
						]
					}
				}
			},
			{
				name: "user_mft_ata",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "user"
						},
						{
							kind: "account",
							path: "token_program"
						},
						{
							kind: "account",
							path: "mft_mint"
						}
					],
					program: {
						kind: "const",
						value: [
							140,
							151,
							37,
							143,
							78,
							36,
							137,
							241,
							187,
							61,
							16,
							41,
							20,
							142,
							13,
							131,
							11,
							90,
							19,
							153,
							218,
							255,
							16,
							132,
							4,
							142,
							123,
							216,
							219,
							233,
							248,
							89
						]
					}
				}
			},
			{
				name: "old_token_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								111,
								108,
								100,
								95,
								116,
								111,
								107,
								101,
								110,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "old_token_mint"
			},
			{
				name: "mft_mint",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								109,
								102,
								116,
								95,
								109,
								105,
								110,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "user_migration",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								117,
								115,
								101,
								114,
								95,
								109,
								105,
								103,
								114,
								97,
								116,
								105,
								111,
								110
							]
						},
						{
							kind: "arg",
							path: "project_id"
						},
						{
							kind: "account",
							path: "user"
						}
					]
				}
			},
			{
				name: "old_token_program"
			},
			{
				name: "token_program",
				address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
			},
			{
				name: "associated_token_program",
				address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			},
			{
				name: "amount",
				type: "u64"
			}
		]
	},
	{
		name: "pause_project",
		discriminator: [
			8,
			68,
			240,
			82,
			45,
			162,
			129,
			230
		],
		accounts: [
			{
				name: "admin",
				writable: true,
				signer: true
			},
			{
				name: "project_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			},
			{
				name: "pause",
				type: "bool"
			}
		]
	},
	{
		name: "propose_platform_admin",
		discriminator: [
			26,
			187,
			5,
			155,
			78,
			207,
			193,
			4
		],
		accounts: [
			{
				name: "platform_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								108,
								97,
								116,
								102,
								111,
								114,
								109,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						}
					]
				}
			},
			{
				name: "admin",
				writable: true,
				signer: true
			},
			{
				name: "candidate",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								108,
								97,
								116,
								102,
								111,
								114,
								109,
								95,
								97,
								100,
								109,
								105,
								110,
								95,
								99,
								97,
								110,
								100,
								105,
								100,
								97,
								116,
								101
							]
						}
					]
				}
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			}
		],
		args: [
			{
				name: "new_admin",
				type: "pubkey"
			}
		]
	},
	{
		name: "recover_unclaimed",
		discriminator: [
			145,
			250,
			67,
			46,
			166,
			179,
			123,
			166
		],
		accounts: [
			{
				name: "admin",
				writable: true,
				signer: true
			},
			{
				name: "project_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "pool_config"
			},
			{
				name: "old_token_vault",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								111,
								108,
								100,
								95,
								116,
								111,
								107,
								101,
								110,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "new_token_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								110,
								101,
								119,
								95,
								116,
								111,
								107,
								101,
								110,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "quote_token_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								113,
								117,
								111,
								116,
								101,
								95,
								116,
								111,
								107,
								101,
								110,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "new_token_mint"
			},
			{
				name: "quote_token_mint"
			},
			{
				name: "admin_new_token_ata",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "admin"
						},
						{
							kind: "account",
							path: "new_token_program"
						},
						{
							kind: "account",
							path: "new_token_mint"
						}
					],
					program: {
						kind: "const",
						value: [
							140,
							151,
							37,
							143,
							78,
							36,
							137,
							241,
							187,
							61,
							16,
							41,
							20,
							142,
							13,
							131,
							11,
							90,
							19,
							153,
							218,
							255,
							16,
							132,
							4,
							142,
							123,
							216,
							219,
							233,
							248,
							89
						]
					}
				}
			},
			{
				name: "admin_quote_token_ata",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "admin"
						},
						{
							kind: "account",
							path: "quote_token_program"
						},
						{
							kind: "account",
							path: "quote_token_mint"
						}
					],
					program: {
						kind: "const",
						value: [
							140,
							151,
							37,
							143,
							78,
							36,
							137,
							241,
							187,
							61,
							16,
							41,
							20,
							142,
							13,
							131,
							11,
							90,
							19,
							153,
							218,
							255,
							16,
							132,
							4,
							142,
							123,
							216,
							219,
							233,
							248,
							89
						]
					}
				}
			},
			{
				name: "new_token_program"
			},
			{
				name: "quote_token_program"
			},
			{
				name: "associated_token_program",
				address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			}
		]
	},
	{
		name: "set_merkle_root",
		discriminator: [
			43,
			24,
			91,
			60,
			240,
			137,
			28,
			102
		],
		accounts: [
			{
				name: "admin",
				writable: true,
				signer: true
			},
			{
				name: "config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			},
			{
				name: "merkle_root",
				type: {
					array: [
						"u8",
						32
					]
				}
			},
			{
				name: "merkle_allocation",
				type: "u64"
			}
		]
	},
	{
		name: "toggle_project_emergency_withdraw",
		discriminator: [
			167,
			126,
			170,
			252,
			248,
			123,
			88,
			46
		],
		accounts: [
			{
				name: "platform_admin",
				writable: true,
				signer: true
			},
			{
				name: "platform_config",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								108,
								97,
								116,
								102,
								111,
								114,
								109,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						}
					]
				}
			},
			{
				name: "project_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			},
			{
				name: "enabled",
				type: "bool"
			}
		]
	},
	{
		name: "update_fee",
		discriminator: [
			232,
			253,
			195,
			247,
			148,
			212,
			73,
			222
		],
		accounts: [
			{
				name: "platform_config",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								108,
								97,
								116,
								102,
								111,
								114,
								109,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						}
					]
				}
			},
			{
				name: "platform_admin",
				signer: true
			},
			{
				name: "project_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			},
			{
				name: "new_fee_basis_points",
				type: "u16"
			}
		]
	},
	{
		name: "update_platform_config",
		discriminator: [
			195,
			60,
			76,
			129,
			146,
			45,
			67,
			143
		],
		accounts: [
			{
				name: "platform_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								108,
								97,
								116,
								102,
								111,
								114,
								109,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						}
					]
				}
			},
			{
				name: "admin",
				signer: true
			},
			{
				name: "new_treasury_account"
			}
		],
		args: [
			{
				name: "new_admin",
				type: {
					option: "pubkey"
				}
			},
			{
				name: "new_treasury",
				type: {
					option: "pubkey"
				}
			},
			{
				name: "new_default_fee_basis_points",
				type: {
					option: "u16"
				}
			},
			{
				name: "new_project_creation_fee",
				type: {
					option: "u64"
				}
			},
			{
				name: "new_is_paused",
				type: {
					option: "bool"
				}
			}
		]
	},
	{
		name: "update_project_admin",
		discriminator: [
			150,
			218,
			97,
			90,
			149,
			210,
			11,
			76
		],
		accounts: [
			{
				name: "current_admin",
				docs: [
					"Current admin who is transferring control"
				],
				writable: true,
				signer: true
			},
			{
				name: "new_admin",
				docs: [
					"We don't require them to sign since they might not be available",
					"(e.g., setting up a new wallet)"
				]
			},
			{
				name: "project_config",
				docs: [
					"The project config being updated"
				],
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			}
		]
	},
	{
		name: "verify_lp_lock",
		discriminator: [
			164,
			33,
			234,
			53,
			111,
			225,
			13,
			220
		],
		accounts: [
			{
				name: "admin",
				writable: true,
				signer: true
			},
			{
				name: "project_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "pool_config",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								111,
								111,
								108,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "streamflow_metadata"
			},
			{
				name: "streamflow_program"
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			}
		]
	}
];
var accounts$1 = [
	{
		name: "PlatformAdminCandidate",
		discriminator: [
			179,
			153,
			14,
			240,
			164,
			64,
			193,
			227
		]
	},
	{
		name: "PlatformConfig",
		discriminator: [
			160,
			78,
			128,
			0,
			248,
			83,
			230,
			160
		]
	},
	{
		name: "PoolConfig",
		discriminator: [
			26,
			108,
			14,
			123,
			116,
			230,
			129,
			43
		]
	},
	{
		name: "ProjectConfig",
		discriminator: [
			187,
			239,
			0,
			110,
			5,
			15,
			245,
			65
		]
	},
	{
		name: "UserMerkleClaim",
		discriminator: [
			186,
			112,
			216,
			254,
			119,
			63,
			93,
			26
		]
	},
	{
		name: "UserMigration",
		discriminator: [
			219,
			194,
			245,
			85,
			15,
			214,
			204,
			163
		]
	}
];
var events$1 = [
	{
		name: "AdminLpLocked",
		discriminator: [
			193,
			201,
			47,
			36,
			204,
			224,
			59,
			6
		]
	},
	{
		name: "AdminUpdatedEvent",
		discriminator: [
			87,
			146,
			113,
			247,
			187,
			52,
			223,
			11
		]
	},
	{
		name: "BonkFunLpLocked",
		discriminator: [
			20,
			73,
			36,
			53,
			20,
			133,
			127,
			30
		]
	},
	{
		name: "ClaimsEnabled",
		discriminator: [
			27,
			116,
			118,
			179,
			171,
			8,
			66,
			137
		]
	},
	{
		name: "CommitmentSet",
		discriminator: [
			245,
			41,
			85,
			83,
			205,
			224,
			0,
			143
		]
	},
	{
		name: "CommitmentToppedUp",
		discriminator: [
			227,
			116,
			148,
			84,
			22,
			51,
			244,
			93
		]
	},
	{
		name: "CpmmPoolCreated",
		discriminator: [
			238,
			103,
			157,
			230,
			65,
			143,
			8,
			79
		]
	},
	{
		name: "EmergencyWithdrawEvent",
		discriminator: [
			177,
			61,
			254,
			20,
			145,
			18,
			188,
			237
		]
	},
	{
		name: "ErrorOccurred",
		discriminator: [
			45,
			168,
			251,
			0,
			254,
			251,
			21,
			128
		]
	},
	{
		name: "FailedMigrationFinalized",
		discriminator: [
			192,
			62,
			91,
			253,
			252,
			62,
			83,
			165
		]
	},
	{
		name: "FailedMigrationSolClaimed",
		discriminator: [
			192,
			199,
			24,
			10,
			167,
			85,
			91,
			108
		]
	},
	{
		name: "LpBurned",
		discriminator: [
			7,
			184,
			215,
			76,
			200,
			54,
			6,
			56
		]
	},
	{
		name: "LpLockVerified",
		discriminator: [
			210,
			22,
			111,
			138,
			195,
			157,
			212,
			18
		]
	},
	{
		name: "LpTokensClaimed",
		discriminator: [
			238,
			34,
			104,
			0,
			111,
			229,
			74,
			213
		]
	},
	{
		name: "LpTokensLockedEvent",
		discriminator: [
			70,
			53,
			97,
			39,
			58,
			231,
			247,
			120
		]
	},
	{
		name: "LpTokensLockedWithStreamflow",
		discriminator: [
			234,
			148,
			130,
			141,
			225,
			66,
			122,
			46
		]
	},
	{
		name: "MerkleClaimed",
		discriminator: [
			77,
			94,
			88,
			168,
			214,
			30,
			68,
			0
		]
	},
	{
		name: "MerkleRootSet",
		discriminator: [
			71,
			89,
			215,
			23,
			123,
			11,
			135,
			16
		]
	},
	{
		name: "MftClaimed",
		discriminator: [
			154,
			250,
			129,
			96,
			101,
			241,
			0,
			122
		]
	},
	{
		name: "MigrationEvent",
		discriminator: [
			255,
			202,
			76,
			147,
			91,
			231,
			73,
			22
		]
	},
	{
		name: "MigrationFailed",
		discriminator: [
			134,
			211,
			211,
			164,
			161,
			159,
			212,
			139
		]
	},
	{
		name: "MigrationFailureDeclared",
		discriminator: [
			92,
			115,
			82,
			220,
			207,
			115,
			85,
			140
		]
	},
	{
		name: "MigrationSucceeded",
		discriminator: [
			216,
			199,
			203,
			122,
			112,
			232,
			183,
			14
		]
	},
	{
		name: "MigrationSucceededEarly",
		discriminator: [
			213,
			192,
			145,
			53,
			110,
			181,
			76,
			123
		]
	},
	{
		name: "NewTokensDeposited",
		discriminator: [
			15,
			104,
			21,
			168,
			240,
			171,
			155,
			89
		]
	},
	{
		name: "PartialSwapEvent",
		discriminator: [
			121,
			231,
			249,
			10,
			235,
			136,
			126,
			205
		]
	},
	{
		name: "PlatformConfigUpdated",
		discriminator: [
			198,
			206,
			187,
			204,
			148,
			251,
			237,
			25
		]
	},
	{
		name: "PlatformFeesClaimedEvent",
		discriminator: [
			253,
			217,
			84,
			147,
			249,
			44,
			26,
			35
		]
	},
	{
		name: "PlatformInitialized",
		discriminator: [
			16,
			222,
			212,
			5,
			213,
			140,
			112,
			162
		]
	},
	{
		name: "ProjectCreatedEvent",
		discriminator: [
			211,
			119,
			21,
			209,
			113,
			178,
			141,
			38
		]
	},
	{
		name: "ProjectCreationFeeCollected",
		discriminator: [
			88,
			9,
			14,
			213,
			25,
			213,
			28,
			118
		]
	},
	{
		name: "ProjectEmergencyWithdrawToggled",
		discriminator: [
			195,
			54,
			114,
			114,
			143,
			222,
			164,
			67
		]
	},
	{
		name: "ProjectFeeUpdated",
		discriminator: [
			49,
			83,
			247,
			111,
			97,
			41,
			250,
			81
		]
	},
	{
		name: "ProjectFinalized",
		discriminator: [
			206,
			140,
			138,
			3,
			23,
			210,
			23,
			204
		]
	},
	{
		name: "ProjectInitialized",
		discriminator: [
			222,
			194,
			81,
			9,
			16,
			183,
			224,
			22
		]
	},
	{
		name: "ProjectInitializedEvent",
		discriminator: [
			199,
			63,
			149,
			189,
			143,
			15,
			56,
			253
		]
	},
	{
		name: "ProjectPaused",
		discriminator: [
			126,
			250,
			145,
			29,
			201,
			145,
			236,
			173
		]
	},
	{
		name: "PumpFunTokenCreated",
		discriminator: [
			228,
			29,
			83,
			133,
			132,
			70,
			38,
			131
		]
	},
	{
		name: "RefundClaimed",
		discriminator: [
			136,
			64,
			242,
			99,
			4,
			244,
			208,
			130
		]
	},
	{
		name: "SolRefundClaimed",
		discriminator: [
			184,
			234,
			43,
			249,
			123,
			73,
			253,
			176
		]
	},
	{
		name: "SwapWarning",
		discriminator: [
			193,
			56,
			83,
			255,
			91,
			236,
			18,
			49
		]
	},
	{
		name: "TokenMarkedAsCreated",
		discriminator: [
			96,
			236,
			103,
			52,
			129,
			34,
			221,
			41
		]
	},
	{
		name: "TokenMigrated",
		discriminator: [
			109,
			61,
			145,
			107,
			50,
			158,
			28,
			154
		]
	},
	{
		name: "TokenSwappedToQuote",
		discriminator: [
			247,
			7,
			255,
			108,
			157,
			48,
			140,
			19
		]
	},
	{
		name: "TransferredToClaims",
		discriminator: [
			5,
			238,
			85,
			97,
			140,
			132,
			252,
			47
		]
	},
	{
		name: "UnclaimedAssetsRecovered",
		discriminator: [
			42,
			183,
			43,
			222,
			11,
			234,
			142,
			46
		]
	},
	{
		name: "UnclaimedFailureRecovered",
		discriminator: [
			129,
			54,
			143,
			170,
			57,
			120,
			102,
			5
		]
	}
];
var errors$1 = [
	{
		code: 6000,
		name: "MigrationWindowClosed",
		msg: "Migration windows has closed"
	},
	{
		code: 6001,
		name: "MigrationNotEnded",
		msg: "Migration period has not ended yet"
	},
	{
		code: 6002,
		name: "MigrationAlreadyStarted",
		msg: "Migration has already started"
	},
	{
		code: 6003,
		name: "AlreadyFinalized",
		msg: "Migration already finalized"
	},
	{
		code: 6004,
		name: "CannotFinalizeEarly",
		msg: "Cannot finalize before migration end"
	},
	{
		code: 6005,
		name: "AlreadyEvaluated",
		msg: "Migration has already been evaluated"
	},
	{
		code: 6006,
		name: "NoMigration",
		msg: "No migration"
	},
	{
		code: 6007,
		name: "MigrationNotEvaluated",
		msg: "Migration has not been evaluated yet"
	},
	{
		code: 6008,
		name: "MigrationFailed",
		msg: "Migration failed - tokens will be refunded"
	},
	{
		code: 6009,
		name: "InvalidProjectId",
		msg: "Invalid project ID - must be lowercase, <= 16 chars, no spaces"
	},
	{
		code: 6010,
		name: "InvalidProjectName",
		msg: "Invalid project name - must be <= 32 characters"
	},
	{
		code: 6011,
		name: "ProjectNotInitialized",
		msg: "Project not initialized"
	},
	{
		code: 6012,
		name: "ProjectAlreadyExists",
		msg: "Project already exists"
	},
	{
		code: 6013,
		name: "ProjectNotFinalized",
		msg: "Project has not been finalized"
	},
	{
		code: 6014,
		name: "ProjectIdMismatch",
		msg: "Project ID mismatch"
	},
	{
		code: 6015,
		name: "ProjectPaused",
		msg: "Project is paused - migrations are temporarily disabled"
	},
	{
		code: 6016,
		name: "ProjectFinalized",
		msg: "Project is finalized"
	},
	{
		code: 6017,
		name: "ProjectNotActive",
		msg: "Project not active"
	},
	{
		code: 6018,
		name: "InvalidProject",
		msg: "Invalid project"
	},
	{
		code: 6019,
		name: "InvalidTimeRange",
		msg: "Invalid time range configuration"
	},
	{
		code: 6020,
		name: "DeadlineNotReached",
		msg: "Deadline not reached"
	},
	{
		code: 6021,
		name: "DeadlineReached",
		msg: "Deadline has been reached - use evaluate instead"
	},
	{
		code: 6022,
		name: "RecoveryPeriodNotReached",
		msg: "Recovery period has not been reached"
	},
	{
		code: 6023,
		name: "UnclaimedRecoveryNotStarted",
		msg: "Unclaimed recovery period has not started"
	},
	{
		code: 6024,
		name: "InvalidAdmin",
		msg: "Invalid admin"
	},
	{
		code: 6025,
		name: "UnauthorizedAdmin",
		msg: "Unauthorized admin"
	},
	{
		code: 6026,
		name: "InvalidPlatformAdmin",
		msg: "Invalid platform admin"
	},
	{
		code: 6027,
		name: "InvalidUser",
		msg: "Invalid user"
	},
	{
		code: 6028,
		name: "PlatformPaused",
		msg: "Platform is paused"
	},
	{
		code: 6029,
		name: "VaultNotEmpty",
		msg: "Vault is not empty - contains LP tokens"
	},
	{
		code: 6030,
		name: "InvalidVaultAddress",
		msg: "Invalid vault address"
	},
	{
		code: 6031,
		name: "InvalidVault",
		msg: "Invalid vault"
	},
	{
		code: 6032,
		name: "VaultsNotInitialized",
		msg: "Vaults not initialized"
	},
	{
		code: 6033,
		name: "InvalidVaultOwner",
		msg: "Invalid vault owner"
	},
	{
		code: 6034,
		name: "InsufficientVaultBalance",
		msg: "Insufficient vault balance"
	},
	{
		code: 6035,
		name: "NoTokensToSwap",
		msg: "No tokens available to swap"
	},
	{
		code: 6036,
		name: "TokensAlreadyDeposited",
		msg: "New tokens have already been deposited"
	},
	{
		code: 6037,
		name: "InvalidDepositAmount",
		msg: "Invalid deposit amount"
	},
	{
		code: 6038,
		name: "InvalidDecimals",
		msg: "Invalid decimal places - must be 9 or less"
	},
	{
		code: 6039,
		name: "InvalidMintOwner",
		msg: "Invalid mint owner - must be Token or Token-2022 program"
	},
	{
		code: 6040,
		name: "InvalidTokenProgram",
		msg: "Invalid token program"
	},
	{
		code: 6041,
		name: "InvalidSourcePoolProgram",
		msg: "Invalid source pool program"
	},
	{
		code: 6042,
		name: "InvalidSourcePoolId",
		msg: "Invalid source pool ID - pool account must be owned by the source pool program"
	},
	{
		code: 6043,
		name: "OldAndNewMintCannotMatch",
		msg: "Old and new token mints cannot be the same"
	},
	{
		code: 6044,
		name: "InvalidTokenAccountOwner",
		msg: "Invalid token account owner"
	},
	{
		code: 6045,
		name: "InvalidMint",
		msg: "Invalid mint"
	},
	{
		code: 6046,
		name: "InvalidProgram",
		msg: "Invalid program ID"
	},
	{
		code: 6047,
		name: "InvalidAccountData",
		msg: "Invalid account data"
	},
	{
		code: 6048,
		name: "InvalidAccountCount",
		msg: "Invalid account count for instruction"
	},
	{
		code: 6049,
		name: "InvalidTokenType",
		msg: "Invalid token type specified"
	},
	{
		code: 6050,
		name: "PoolAlreadyCreated",
		msg: "Pool has already been created"
	},
	{
		code: 6051,
		name: "PoolNotCreated",
		msg: "Pool has not been created yet"
	},
	{
		code: 6052,
		name: "InsufficientLiquidity",
		msg: "Insufficient liquidity for pool creation"
	},
	{
		code: 6053,
		name: "InvalidPoolType",
		msg: "Invalid pool type"
	},
	{
		code: 6054,
		name: "MustUseAllQuoteTokens",
		msg: "Must use all quote tokens (SOL/USDC) from vault for pool creation"
	},
	{
		code: 6055,
		name: "InvalidPoolConfig",
		msg: "Invalid pool config account"
	},
	{
		code: 6056,
		name: "NoLpTokensAvailable",
		msg: "No LP tokens available to claim"
	},
	{
		code: 6057,
		name: "AlreadyClaimed",
		msg: "Already claimed"
	},
	{
		code: 6058,
		name: "ClaimsNotEnabled",
		msg: "Claims are not enabled yet"
	},
	{
		code: 6059,
		name: "ClaimsAlreadyEnabled",
		msg: "Claims are already enabled"
	},
	{
		code: 6060,
		name: "ClaimsExpired",
		msg: "Claims expired"
	},
	{
		code: 6061,
		name: "ClaimsNotExpired",
		msg: "Claims period has not expired - users still have time to claim"
	},
	{
		code: 6062,
		name: "AlreadyRecovered",
		msg: "Assets have already been recovered"
	},
	{
		code: 6063,
		name: "NothingToRecover",
		msg: "No assets available to recover"
	},
	{
		code: 6064,
		name: "InvalidFeeRate",
		msg: "Invalid fee rate"
	},
	{
		code: 6065,
		name: "InsufficientBalance",
		msg: "Insufficient balance to pay project creation fee"
	},
	{
		code: 6066,
		name: "NoFeesToClaim",
		msg: "No fees to claim"
	},
	{
		code: 6067,
		name: "InvalidTreasury",
		msg: "Invalid treasury account"
	},
	{
		code: 6068,
		name: "NoRefundsAvailable",
		msg: "No refunds available"
	},
	{
		code: 6069,
		name: "RefundsExceeded",
		msg: "Total refunds would exceed available funds"
	},
	{
		code: 6070,
		name: "InvalidPercentage",
		msg: "Invalid percentage - must be between 1 and 100"
	},
	{
		code: 6071,
		name: "InvalidTargetPercentage",
		msg: "Invalid target percentage - must be between 1% and 100%"
	},
	{
		code: 6072,
		name: "InvalidHaircut",
		msg: "Invalid haircut percentage - must be <= 100%"
	},
	{
		code: 6073,
		name: "InvalidSupply",
		msg: "Invalid supply - must be greater than 0"
	},
	{
		code: 6074,
		name: "InvalidAmount",
		msg: "Invalid amount"
	},
	{
		code: 6075,
		name: "AmountTooSmall",
		msg: "Migration amount too small - would result in 0 MFT tokens due to precision loss"
	},
	{
		code: 6076,
		name: "TargetNotReached",
		msg: "Target percentage not reached"
	},
	{
		code: 6077,
		name: "InvalidExchangeRate",
		msg: "Invalid exchange rate - must be > 0 and <= 10,000,000 basis points (1,000x)"
	},
	{
		code: 6078,
		name: "InvalidStreamflowContract",
		msg: "Invalid Streamflow contract"
	},
	{
		code: 6079,
		name: "InvalidLockDuration",
		msg: "Invalid lock duration"
	},
	{
		code: 6080,
		name: "AlreadyVerified",
		msg: "Lock already verified"
	},
	{
		code: 6081,
		name: "MissingBonkFunRecipient",
		msg: "Missing BONK.fun recipient address"
	},
	{
		code: 6082,
		name: "InvalidBonkFunPercentage",
		msg: "Invalid BONK.fun percentage - must be between 50% and 95%"
	},
	{
		code: 6083,
		name: "InvalidBonkFunRecipient",
		msg: "Invalid BONK.fun recipient address"
	},
	{
		code: 6084,
		name: "MerkleRootAlreadySet",
		msg: "Merkle root already set"
	},
	{
		code: 6085,
		name: "MerkleRootNotSet",
		msg: "Merkle root not set"
	},
	{
		code: 6086,
		name: "InvalidMerkleProof",
		msg: "Invalid merkle proof"
	},
	{
		code: 6087,
		name: "Overflow",
		msg: "Calculation overflow"
	},
	{
		code: 6088,
		name: "Underflow",
		msg: "Calculation underflow"
	},
	{
		code: 6089,
		name: "MathOverflow",
		msg: "Math overflow in calculation"
	},
	{
		code: 6090,
		name: "InsufficientAccounts",
		msg: "Insufficient accounts provided for instruction"
	},
	{
		code: 6091,
		name: "InvalidRemainingAccounts",
		msg: "Invalid remaining accounts provided"
	},
	{
		code: 6092,
		name: "InvalidOperation",
		msg: "Invalid operation"
	},
	{
		code: 6093,
		name: "TransferFailed",
		msg: "Transfer failed"
	},
	{
		code: 6094,
		name: "EmergencyWithdrawDisabled",
		msg: "Emergency withdraw is disabled for this protected migration"
	},
	{
		code: 6095,
		name: "EmergencyWithdrawNotAllowed",
		msg: "Emergency withdraw requires project to be paused or migration period to be ended"
	},
	{
		code: 6096,
		name: "InvalidOwner",
		msg: "Invalid owner of account"
	},
	{
		code: 6097,
		name: "NotImplemented",
		msg: "Not implemented"
	}
];
var types$1 = [
	{
		name: "AdminLpLocked",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "admin",
					type: "pubkey"
				},
				{
					name: "nft_mint",
					type: "pubkey"
				},
				{
					name: "amount",
					type: "u64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "AdminUpdatedEvent",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "old_admin",
					type: "pubkey"
				},
				{
					name: "new_admin",
					type: "pubkey"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "BonkFunLpLocked",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "bonk_fun_recipient",
					type: "pubkey"
				},
				{
					name: "nft_mint",
					type: "pubkey"
				},
				{
					name: "bonk_fun_amount",
					type: "u64"
				},
				{
					name: "admin_amount",
					type: "u64"
				},
				{
					name: "admin_nft_mint",
					type: "pubkey"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "ClaimsEnabled",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "CommitmentSet",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "committed_sol_percentage",
					type: "u8"
				},
				{
					name: "minimum_sol_amount",
					type: "u64"
				},
				{
					name: "committed_pool_deadline_days",
					type: "u8"
				},
				{
					name: "deadline_ts",
					type: "i64"
				}
			]
		}
	},
	{
		name: "CommitmentToppedUp",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "admin",
					type: "pubkey"
				},
				{
					name: "extracted_sol",
					type: "u64"
				},
				{
					name: "required_sol",
					type: "u64"
				},
				{
					name: "topped_up_amount",
					type: "u64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "CpmmPoolCreated",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "pool_address",
					type: "pubkey"
				},
				{
					name: "lp_mint",
					type: "pubkey"
				},
				{
					name: "quote_amount",
					type: "u64"
				},
				{
					name: "new_token_amount",
					type: "u64"
				},
				{
					name: "lp_tokens_received",
					type: "u64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "CreateProjectParams",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_name",
					type: "string"
				},
				{
					name: "start_ts",
					type: "i64"
				},
				{
					name: "end_ts",
					type: "i64"
				},
				{
					name: "source_pool_type",
					type: {
						defined: {
							name: "SourcePoolType"
						}
					}
				},
				{
					name: "protection_params",
					type: {
						option: {
							defined: {
								name: "ProtectionParams"
							}
						}
					}
				},
				{
					name: "exchange_rate_basis_points",
					type: {
						option: "u32"
					}
				},
				{
					name: "output_pool_type",
					type: {
						option: {
							defined: {
								name: "OutputPoolType"
							}
						}
					}
				}
			]
		}
	},
	{
		name: "EmergencyWithdrawEvent",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "admin",
					type: "pubkey"
				},
				{
					name: "token_type",
					type: "u8"
				},
				{
					name: "amount",
					type: "u64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "ErrorOccurred",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "error_code",
					type: "u32"
				},
				{
					name: "error_msg",
					type: "string"
				},
				{
					name: "instruction",
					type: "string"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "FailedMigrationFinalized",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "no_swap_executed",
					type: "bool"
				},
				{
					name: "sol_available_for_refunds",
					type: "u64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "FailedMigrationSolClaimed",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "user",
					type: "pubkey"
				},
				{
					name: "amount_claimed",
					type: "u64"
				},
				{
					name: "user_tokens_migrated",
					type: "u64"
				},
				{
					name: "total_distributed",
					type: "u64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "LpBurned",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "burn_amount",
					type: "u64"
				},
				{
					name: "total_lp_amount",
					type: "u64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "LpLockVerified",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "streamflow_contract",
					type: "pubkey"
				},
				{
					name: "recipient",
					type: "pubkey"
				},
				{
					name: "amount",
					type: "u64"
				},
				{
					name: "unlock_timestamp",
					type: "i64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "LpTokensClaimed",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "admin",
					type: "pubkey"
				},
				{
					name: "lp_amount",
					type: "u64"
				},
				{
					name: "claimed_at",
					type: "i64"
				}
			]
		}
	},
	{
		name: "LpTokensLockedEvent",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "amount",
					type: "u64"
				},
				{
					name: "lock_duration_days",
					type: "u64"
				},
				{
					name: "unlock_timestamp",
					type: "i64"
				},
				{
					name: "streamflow_contract",
					type: "pubkey"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "LpTokensLockedWithStreamflow",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "streamflow_contract",
					type: "pubkey"
				},
				{
					name: "amount",
					type: "u64"
				},
				{
					name: "lock_duration_days",
					type: "u64"
				},
				{
					name: "unlock_timestamp",
					type: "i64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "MerkleClaimed",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "user",
					type: "pubkey"
				},
				{
					name: "amount",
					type: "u64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "MerkleRootSet",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "merkle_root",
					type: {
						array: [
							"u8",
							32
						]
					}
				},
				{
					name: "merkle_allocation",
					type: "u64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "MftClaimed",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "user",
					type: "pubkey"
				},
				{
					name: "mft_burned",
					type: "u64"
				},
				{
					name: "new_tokens_received",
					type: "u64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "MigrationEvent",
		type: {
			kind: "struct",
			fields: [
				{
					name: "user",
					type: "pubkey"
				},
				{
					name: "tnsr_in",
					type: "u64"
				},
				{
					name: "hustle_out",
					type: "u64"
				},
				{
					name: "ts",
					type: "i64"
				}
			]
		}
	},
	{
		name: "MigrationFailed",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "final_percentage",
					type: "u16"
				},
				{
					name: "target_percentage",
					type: "u16"
				},
				{
					name: "total_migrated",
					type: "u64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "MigrationFailureDeclared",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "total_sol",
					type: "u64"
				},
				{
					name: "total_tokens",
					type: "u64"
				},
				{
					name: "deadline_missed_ts",
					type: "i64"
				},
				{
					name: "declared_at",
					type: "i64"
				}
			]
		}
	},
	{
		name: "MigrationSucceeded",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "final_percentage",
					type: "u16"
				},
				{
					name: "total_migrated",
					type: "u64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "MigrationSucceededEarly",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "final_percentage",
					type: "u16"
				},
				{
					name: "days_before_deadline",
					type: "i64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "NewTokensDeposited",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "amount",
					type: "u64"
				},
				{
					name: "admin",
					type: "pubkey"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "OutputPoolType",
		type: {
			kind: "enum",
			variants: [
				{
					name: "RaydiumCPMM"
				},
				{
					name: "RaydiumCPMMBonkFunMeme"
				},
				{
					name: "RaydiumCPMMBonkFunTech"
				},
				{
					name: "PumpFunBondingCurve"
				}
			]
		}
	},
	{
		name: "PartialSwapEvent",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "amount_swapped",
					type: "u64"
				},
				{
					name: "quote_received",
					type: "u64"
				},
				{
					name: "remaining_balance",
					type: "u64"
				},
				{
					name: "is_finalized",
					type: "bool"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "PlatformAdminCandidate",
		type: {
			kind: "struct",
			fields: [
				{
					name: "candidate",
					type: "pubkey"
				},
				{
					name: "bump",
					type: "u8"
				}
			]
		}
	},
	{
		name: "PlatformConfig",
		type: {
			kind: "struct",
			fields: [
				{
					name: "admin",
					type: "pubkey"
				},
				{
					name: "treasury",
					type: "pubkey"
				},
				{
					name: "default_fee_basis_points",
					type: "u16"
				},
				{
					name: "project_creation_fee",
					type: "u64"
				},
				{
					name: "is_paused",
					type: "bool"
				},
				{
					name: "bump",
					type: "u8"
				}
			]
		}
	},
	{
		name: "PlatformConfigUpdated",
		type: {
			kind: "struct",
			fields: [
				{
					name: "admin",
					type: "pubkey"
				},
				{
					name: "new_admin",
					type: {
						option: "pubkey"
					}
				},
				{
					name: "new_treasury",
					type: {
						option: "pubkey"
					}
				},
				{
					name: "new_default_fee",
					type: {
						option: "u16"
					}
				},
				{
					name: "new_creation_fee",
					type: {
						option: "u64"
					}
				},
				{
					name: "is_paused",
					type: {
						option: "bool"
					}
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "PlatformFeesClaimedEvent",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "amount",
					type: "u64"
				},
				{
					name: "treasury",
					type: "pubkey"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "PlatformInitialized",
		type: {
			kind: "struct",
			fields: [
				{
					name: "admin",
					type: "pubkey"
				},
				{
					name: "treasury",
					type: "pubkey"
				},
				{
					name: "default_fee_basis_points",
					type: "u16"
				},
				{
					name: "project_creation_fee",
					type: "u64"
				}
			]
		}
	},
	{
		name: "PoolConfig",
		docs: [
			"Separate account to store CPMM pool configuration",
			"This avoids stack overflow issues in the main ProjectConfig"
		],
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "raydium_cpmm_program",
					type: "pubkey"
				},
				{
					name: "raydium_cpmm_config",
					type: "pubkey"
				},
				{
					name: "raydium_cpmm_pool",
					type: "pubkey"
				},
				{
					name: "lp_mint",
					type: "pubkey"
				},
				{
					name: "lp_vault",
					type: "pubkey"
				},
				{
					name: "pool_created",
					type: "bool"
				},
				{
					name: "pool_creation_ts",
					type: "i64"
				},
				{
					name: "lp_tokens_amount",
					type: "u64"
				},
				{
					name: "lp_locked_amount",
					type: "u64"
				},
				{
					name: "streamflow_metadata_account",
					type: "pubkey"
				},
				{
					name: "lp_lock_duration_days",
					type: "u64"
				},
				{
					name: "bonk_fun_nft_mint",
					type: "pubkey"
				},
				{
					name: "bonk_fun_lp_amount",
					type: "u64"
				},
				{
					name: "admin_lp_amount",
					type: "u64"
				},
				{
					name: "bonk_fun_lock_completed",
					type: "bool"
				},
				{
					name: "admin_nft_mint",
					type: "pubkey"
				},
				{
					name: "burn_lp_amount",
					type: "u64"
				},
				{
					name: "burn_lock_completed",
					type: "bool"
				},
				{
					name: "bump",
					type: "u8"
				}
			]
		}
	},
	{
		name: "ProjectConfig",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "project_name",
					type: "string"
				},
				{
					name: "admin",
					type: "pubkey"
				},
				{
					name: "old_token_mint",
					type: "pubkey"
				},
				{
					name: "new_token_mint",
					type: "pubkey"
				},
				{
					name: "old_token_vault",
					type: "pubkey"
				},
				{
					name: "new_token_vault",
					type: "pubkey"
				},
				{
					name: "quote_token_vault",
					type: "pubkey"
				},
				{
					name: "old_token_program",
					type: "pubkey"
				},
				{
					name: "new_token_program",
					type: "pubkey"
				},
				{
					name: "quote_token_mint",
					type: "pubkey"
				},
				{
					name: "quote_token_program",
					type: "pubkey"
				},
				{
					name: "start_ts",
					type: "i64"
				},
				{
					name: "end_ts",
					type: "i64"
				},
				{
					name: "total_migrated",
					type: "u64"
				},
				{
					name: "fee_basis_points",
					type: "u16"
				},
				{
					name: "exchange_rate_basis_points",
					type: "u32"
				},
				{
					name: "source_pool_type",
					type: {
						defined: {
							name: "SourcePoolType"
						}
					}
				},
				{
					name: "source_pool_id",
					type: "pubkey"
				},
				{
					name: "source_pool_program",
					type: "pubkey"
				},
				{
					name: "output_pool_type",
					type: {
						defined: {
							name: "OutputPoolType"
						}
					}
				},
				{
					name: "is_finalized",
					type: "bool"
				},
				{
					name: "is_paused",
					type: "bool"
				},
				{
					name: "pool_created",
					type: "bool"
				},
				{
					name: "token_created_by_platform",
					type: "bool"
				},
				{
					name: "is_protected",
					type: "bool"
				},
				{
					name: "target_migration_percentage",
					type: "u16"
				},
				{
					name: "total_old_token_supply",
					type: "u64"
				},
				{
					name: "migration_deadline",
					type: "i64"
				},
				{
					name: "migration_succeeded",
					type: "bool"
				},
				{
					name: "migration_failed",
					type: "bool"
				},
				{
					name: "total_old_tokens_swapped",
					type: "u64"
				},
				{
					name: "total_quote_tokens_received",
					type: "u64"
				},
				{
					name: "total_new_tokens_in_pool",
					type: "u64"
				},
				{
					name: "total_quote_tokens_in_pool",
					type: "u64"
				},
				{
					name: "total_refunded",
					type: "u64"
				},
				{
					name: "total_quote_tokens_for_refunds",
					type: "u64"
				},
				{
					name: "unclaimed_fees",
					type: "u64"
				},
				{
					name: "streamflow_contract",
					type: "pubkey"
				},
				{
					name: "lp_locked_externally",
					type: "bool"
				},
				{
					name: "lp_lock_verified",
					type: "bool"
				},
				{
					name: "old_token_decimals",
					type: "u8"
				},
				{
					name: "new_token_decimals",
					type: "u8"
				},
				{
					name: "emergency_withdraw_enabled",
					type: "bool"
				},
				{
					name: "new_tokens_deposited",
					type: "bool"
				},
				{
					name: "late_claim_haircut_bps",
					type: "u16"
				},
				{
					name: "claims_enabled",
					type: "bool"
				},
				{
					name: "merkle_root",
					type: {
						array: [
							"u8",
							32
						]
					}
				},
				{
					name: "vaults_initialized",
					type: "bool"
				},
				{
					name: "has_recovered",
					type: "bool"
				},
				{
					name: "merkle_claims_allocation",
					type: "u64"
				},
				{
					name: "bump",
					type: "u8"
				}
			]
		}
	},
	{
		name: "ProjectCreatedEvent",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "project_name",
					type: "string"
				},
				{
					name: "authority",
					type: "pubkey"
				},
				{
					name: "old_token_mint",
					type: "pubkey"
				},
				{
					name: "new_token_mint",
					type: "pubkey"
				},
				{
					name: "old_token_vault",
					type: "pubkey"
				},
				{
					name: "new_token_vault",
					type: "pubkey"
				},
				{
					name: "quote_token_vault",
					type: "pubkey"
				},
				{
					name: "is_protected",
					type: "bool"
				},
				{
					name: "target_percentage",
					type: "u16"
				},
				{
					name: "migration_deadline",
					type: "i64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "ProjectCreationFeeCollected",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "amount",
					type: "u64"
				},
				{
					name: "payer",
					type: "pubkey"
				},
				{
					name: "treasury",
					type: "pubkey"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "ProjectEmergencyWithdrawToggled",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "enabled",
					type: "bool"
				},
				{
					name: "platform_admin",
					type: "pubkey"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "ProjectFeeUpdated",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "old_fee",
					type: "u16"
				},
				{
					name: "new_fee",
					type: "u16"
				},
				{
					name: "admin",
					type: "pubkey"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "ProjectFinalized",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "total_migrated",
					type: "u64"
				},
				{
					name: "finalized_at",
					type: "i64"
				}
			]
		}
	},
	{
		name: "ProjectInitialized",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "project_name",
					type: "string"
				},
				{
					name: "admin",
					type: "pubkey"
				},
				{
					name: "old_token_mint",
					type: "pubkey"
				},
				{
					name: "new_token_mint",
					type: "pubkey"
				},
				{
					name: "start_ts",
					type: "i64"
				},
				{
					name: "end_ts",
					type: "i64"
				},
				{
					name: "fee_basis_points",
					type: "u16"
				}
			]
		}
	},
	{
		name: "ProjectInitializedEvent",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "old_token_vault",
					type: "pubkey"
				},
				{
					name: "quote_token_vault",
					type: "pubkey"
				},
				{
					name: "mft_mint",
					type: "pubkey"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "ProjectPaused",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "paused",
					type: "bool"
				},
				{
					name: "admin",
					type: "pubkey"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "ProtectionParams",
		type: {
			kind: "struct",
			fields: [
				{
					name: "target_migration_percentage",
					type: "u16"
				},
				{
					name: "total_old_token_supply",
					type: "u64"
				},
				{
					name: "late_claim_haircut_bps",
					type: "u16"
				}
			]
		}
	},
	{
		name: "PumpFunTokenCreated",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "mint",
					type: "pubkey"
				},
				{
					name: "bonding_curve",
					type: "pubkey"
				},
				{
					name: "token_name",
					type: "string"
				},
				{
					name: "token_symbol",
					type: "string"
				},
				{
					name: "metadata_uri",
					type: "string"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "RefundClaimed",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "user",
					type: "pubkey"
				},
				{
					name: "amount_refunded",
					type: "u64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "SolRefundClaimed",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "user",
					type: "pubkey"
				},
				{
					name: "sol_refunded",
					type: "u64"
				},
				{
					name: "user_tokens_migrated",
					type: "u64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "SourcePoolType",
		type: {
			kind: "enum",
			variants: [
				{
					name: "RaydiumCPMM"
				},
				{
					name: "MeteoraDynamicAMM"
				},
				{
					name: "PumpSwap"
				},
				{
					name: "MeteoraDynamicAMMV2"
				},
				{
					name: "RaydiumV4"
				}
			]
		}
	},
	{
		name: "SwapWarning",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "warning_type",
					type: "string"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "TokenMarkedAsCreated",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "admin",
					type: "pubkey"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "TokenMigrated",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "user",
					type: "pubkey"
				},
				{
					name: "old_tokens_in",
					type: "u64"
				},
				{
					name: "new_tokens_out",
					type: "u64"
				},
				{
					name: "fee_paid",
					type: "u64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "TokenSwappedToQuote",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "old_tokens_swapped",
					type: "u64"
				},
				{
					name: "quote_received",
					type: "u64"
				},
				{
					name: "amm_pool_id",
					type: "pubkey"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "TransferredToClaims",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "amount",
					type: "u64"
				},
				{
					name: "claims_vault",
					type: "pubkey"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "UnclaimedAssetsRecovered",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "admin",
					type: "pubkey"
				},
				{
					name: "old_tokens_remaining",
					type: "u64"
				},
				{
					name: "new_tokens_recovered",
					type: "u64"
				},
				{
					name: "quote_tokens_recovered",
					type: "u64"
				},
				{
					name: "recovered_at",
					type: "i64"
				}
			]
		}
	},
	{
		name: "UnclaimedFailureRecovered",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "admin",
					type: "pubkey"
				},
				{
					name: "amount_recovered",
					type: "u64"
				},
				{
					name: "recovery_deadline_ts",
					type: "i64"
				},
				{
					name: "recovered_at",
					type: "i64"
				}
			]
		}
	},
	{
		name: "UserMerkleClaim",
		type: {
			kind: "struct",
			fields: [
				{
					name: "user",
					type: "pubkey"
				},
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "amount",
					type: "u64"
				},
				{
					name: "claimed_at",
					type: "i64"
				},
				{
					name: "bump",
					type: "u8"
				}
			]
		}
	},
	{
		name: "UserMigration",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "user",
					type: "pubkey"
				},
				{
					name: "amount_migrated",
					type: "u64"
				},
				{
					name: "migrated_at_ts",
					type: "i64"
				},
				{
					name: "has_claimed_failed_sol",
					type: "bool"
				},
				{
					name: "failed_sol_claimed",
					type: "u64"
				},
				{
					name: "has_claimed_refund",
					type: "bool"
				},
				{
					name: "refund_claimed_at",
					type: "i64"
				},
				{
					name: "bump",
					type: "u8"
				}
			]
		}
	}
];
var devnetIdlJson = {
	address: address$1,
	metadata: metadata$1,
	instructions: instructions$1,
	accounts: accounts$1,
	events: events$1,
	errors: errors$1,
	types: types$1
};

var address = "migK824DsBMp2eZXdhSBAWFS6PbvA6UN8DV15HfmstR";
var metadata = {
	name: "hustle_migration",
	version: "0.1.0",
	spec: "0.1.0",
	description: "Created with Anchor"
};
var instructions = [
	{
		name: "burn_lp_portion",
		discriminator: [
			79,
			149,
			82,
			188,
			51,
			208,
			169,
			210
		],
		accounts: [
			{
				name: "project_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "pool_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								111,
								111,
								108,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "lp_vault",
				docs: [
					"LP token vault that holds the tokens to burn"
				],
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								108,
								112,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "lp_mint",
				docs: [
					"LP token mint"
				],
				writable: true
			},
			{
				name: "admin",
				writable: true,
				signer: true,
				relations: [
					"project_config"
				]
			},
			{
				name: "token_program",
				address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			}
		]
	},
	{
		name: "claim_fees",
		discriminator: [
			82,
			251,
			233,
			156,
			12,
			52,
			184,
			202
		],
		accounts: [
			{
				name: "platform_admin",
				writable: true,
				signer: true
			},
			{
				name: "platform_config",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								108,
								97,
								116,
								102,
								111,
								114,
								109,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						}
					]
				}
			},
			{
				name: "platform_fee_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "platform_config"
						},
						{
							kind: "const",
							value: [
								6,
								221,
								246,
								225,
								215,
								101,
								161,
								147,
								217,
								203,
								225,
								70,
								206,
								235,
								121,
								172,
								28,
								180,
								133,
								237,
								95,
								91,
								55,
								145,
								58,
								140,
								245,
								133,
								126,
								255,
								0,
								169
							]
						},
						{
							kind: "account",
							path: "token_mint"
						}
					],
					program: {
						kind: "const",
						value: [
							140,
							151,
							37,
							143,
							78,
							36,
							137,
							241,
							187,
							61,
							16,
							41,
							20,
							142,
							13,
							131,
							11,
							90,
							19,
							153,
							218,
							255,
							16,
							132,
							4,
							142,
							123,
							216,
							219,
							233,
							248,
							89
						]
					}
				}
			},
			{
				name: "treasury"
			},
			{
				name: "treasury_token_ata",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "treasury"
						},
						{
							kind: "const",
							value: [
								6,
								221,
								246,
								225,
								215,
								101,
								161,
								147,
								217,
								203,
								225,
								70,
								206,
								235,
								121,
								172,
								28,
								180,
								133,
								237,
								95,
								91,
								55,
								145,
								58,
								140,
								245,
								133,
								126,
								255,
								0,
								169
							]
						},
						{
							kind: "account",
							path: "token_mint"
						}
					],
					program: {
						kind: "const",
						value: [
							140,
							151,
							37,
							143,
							78,
							36,
							137,
							241,
							187,
							61,
							16,
							41,
							20,
							142,
							13,
							131,
							11,
							90,
							19,
							153,
							218,
							255,
							16,
							132,
							4,
							142,
							123,
							216,
							219,
							233,
							248,
							89
						]
					}
				}
			},
			{
				name: "token_mint"
			},
			{
				name: "token_program",
				address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
			},
			{
				name: "associated_token_program",
				address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			}
		],
		args: [
		]
	},
	{
		name: "claim_refund",
		discriminator: [
			15,
			16,
			30,
			161,
			255,
			228,
			97,
			60
		],
		accounts: [
			{
				name: "user",
				writable: true,
				signer: true
			},
			{
				name: "project_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "user_migration",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								117,
								115,
								101,
								114,
								95,
								109,
								105,
								103,
								114,
								97,
								116,
								105,
								111,
								110
							]
						},
						{
							kind: "arg",
							path: "project_id"
						},
						{
							kind: "account",
							path: "user"
						}
					]
				}
			},
			{
				name: "quote_token_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								113,
								117,
								111,
								116,
								101,
								95,
								116,
								111,
								107,
								101,
								110,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "user_quote_token_ata",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "user"
						},
						{
							kind: "account",
							path: "quote_token_program"
						},
						{
							kind: "account",
							path: "quote_token_mint"
						}
					],
					program: {
						kind: "const",
						value: [
							140,
							151,
							37,
							143,
							78,
							36,
							137,
							241,
							187,
							61,
							16,
							41,
							20,
							142,
							13,
							131,
							11,
							90,
							19,
							153,
							218,
							255,
							16,
							132,
							4,
							142,
							123,
							216,
							219,
							233,
							248,
							89
						]
					}
				}
			},
			{
				name: "quote_token_mint"
			},
			{
				name: "mft_mint",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								109,
								102,
								116,
								95,
								109,
								105,
								110,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "user_mft_ata",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "user"
						},
						{
							kind: "account",
							path: "token_program"
						},
						{
							kind: "account",
							path: "mft_mint"
						}
					],
					program: {
						kind: "const",
						value: [
							140,
							151,
							37,
							143,
							78,
							36,
							137,
							241,
							187,
							61,
							16,
							41,
							20,
							142,
							13,
							131,
							11,
							90,
							19,
							153,
							218,
							255,
							16,
							132,
							4,
							142,
							123,
							216,
							219,
							233,
							248,
							89
						]
					}
				}
			},
			{
				name: "token_program",
				address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
			},
			{
				name: "quote_token_program"
			},
			{
				name: "associated_token_program",
				address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			}
		]
	},
	{
		name: "claim_with_merkle",
		discriminator: [
			42,
			70,
			30,
			26,
			71,
			71,
			164,
			16
		],
		accounts: [
			{
				name: "user",
				writable: true,
				signer: true
			},
			{
				name: "config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "user_claim",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								117,
								115,
								101,
								114,
								95,
								109,
								101,
								114,
								107,
								108,
								101,
								95,
								99,
								108,
								97,
								105,
								109
							]
						},
						{
							kind: "account",
							path: "user"
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "old_token_vault",
				writable: true
			},
			{
				name: "user_old_token_ata",
				writable: true
			},
			{
				name: "new_token_vault",
				writable: true
			},
			{
				name: "user_new_token_ata",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "user"
						},
						{
							kind: "account",
							path: "new_token_program"
						},
						{
							kind: "account",
							path: "new_token_mint"
						}
					],
					program: {
						kind: "const",
						value: [
							140,
							151,
							37,
							143,
							78,
							36,
							137,
							241,
							187,
							61,
							16,
							41,
							20,
							142,
							13,
							131,
							11,
							90,
							19,
							153,
							218,
							255,
							16,
							132,
							4,
							142,
							123,
							216,
							219,
							233,
							248,
							89
						]
					}
				}
			},
			{
				name: "new_token_mint"
			},
			{
				name: "old_token_mint"
			},
			{
				name: "old_token_program"
			},
			{
				name: "new_token_program"
			},
			{
				name: "associated_token_program",
				address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			},
			{
				name: "amount",
				type: "u64"
			},
			{
				name: "proof",
				type: {
					vec: {
						array: [
							"u8",
							32
						]
					}
				}
			}
		]
	},
	{
		name: "claim_with_mft",
		discriminator: [
			232,
			162,
			178,
			244,
			170,
			169,
			199,
			205
		],
		accounts: [
			{
				name: "user",
				writable: true,
				signer: true
			},
			{
				name: "project_config",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "user_mft_ata",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "user"
						},
						{
							kind: "account",
							path: "token_program"
						},
						{
							kind: "account",
							path: "mft_mint"
						}
					],
					program: {
						kind: "const",
						value: [
							140,
							151,
							37,
							143,
							78,
							36,
							137,
							241,
							187,
							61,
							16,
							41,
							20,
							142,
							13,
							131,
							11,
							90,
							19,
							153,
							218,
							255,
							16,
							132,
							4,
							142,
							123,
							216,
							219,
							233,
							248,
							89
						]
					}
				}
			},
			{
				name: "user_new_token_ata",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "user"
						},
						{
							kind: "account",
							path: "new_token_program"
						},
						{
							kind: "account",
							path: "new_token_mint"
						}
					],
					program: {
						kind: "const",
						value: [
							140,
							151,
							37,
							143,
							78,
							36,
							137,
							241,
							187,
							61,
							16,
							41,
							20,
							142,
							13,
							131,
							11,
							90,
							19,
							153,
							218,
							255,
							16,
							132,
							4,
							142,
							123,
							216,
							219,
							233,
							248,
							89
						]
					}
				}
			},
			{
				name: "new_token_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								110,
								101,
								119,
								95,
								116,
								111,
								107,
								101,
								110,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "mft_mint",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								109,
								102,
								116,
								95,
								109,
								105,
								110,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "new_token_mint"
			},
			{
				name: "new_token_program"
			},
			{
				name: "token_program",
				address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
			},
			{
				name: "associated_token_program",
				address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			},
			{
				name: "amount",
				type: "u64"
			}
		]
	},
	{
		name: "create_pool",
		discriminator: [
			233,
			146,
			209,
			142,
			207,
			104,
			64,
			188
		],
		accounts: [
			{
				name: "admin",
				writable: true,
				signer: true
			},
			{
				name: "project_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "pool_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								111,
								111,
								108,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "quote_token_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								113,
								117,
								111,
								116,
								101,
								95,
								116,
								111,
								107,
								101,
								110,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "new_token_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								110,
								101,
								119,
								95,
								116,
								111,
								107,
								101,
								110,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "lp_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								108,
								112,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "admin_quote_token_ata",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "admin"
						},
						{
							kind: "account",
							path: "token_program"
						},
						{
							kind: "account",
							path: "quote_token_mint"
						}
					],
					program: {
						kind: "const",
						value: [
							140,
							151,
							37,
							143,
							78,
							36,
							137,
							241,
							187,
							61,
							16,
							41,
							20,
							142,
							13,
							131,
							11,
							90,
							19,
							153,
							218,
							255,
							16,
							132,
							4,
							142,
							123,
							216,
							219,
							233,
							248,
							89
						]
					}
				}
			},
			{
				name: "admin_new_token_ata",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "admin"
						},
						{
							kind: "account",
							path: "new_token_program"
						},
						{
							kind: "account",
							path: "new_token_mint"
						}
					],
					program: {
						kind: "const",
						value: [
							140,
							151,
							37,
							143,
							78,
							36,
							137,
							241,
							187,
							61,
							16,
							41,
							20,
							142,
							13,
							131,
							11,
							90,
							19,
							153,
							218,
							255,
							16,
							132,
							4,
							142,
							123,
							216,
							219,
							233,
							248,
							89
						]
					}
				}
			},
			{
				name: "admin_lp_ata",
				writable: true
			},
			{
				name: "quote_token_mint"
			},
			{
				name: "new_token_mint"
			},
			{
				name: "cpmm_program"
			},
			{
				name: "amm_config"
			},
			{
				name: "raydium_authority",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								118,
								97,
								117,
								108,
								116,
								95,
								97,
								110,
								100,
								95,
								108,
								112,
								95,
								109,
								105,
								110,
								116,
								95,
								97,
								117,
								116,
								104,
								95,
								115,
								101,
								101,
								100
							]
						}
					],
					program: {
						kind: "account",
						path: "cpmm_program"
					}
				}
			},
			{
				name: "raydium_pool_state",
				docs: [
					"Raydium validates this internally during initialization"
				],
				writable: true
			},
			{
				name: "raydium_lp_mint",
				writable: true
			},
			{
				name: "raydium_token_0_vault",
				writable: true
			},
			{
				name: "raydium_token_1_vault",
				writable: true
			},
			{
				name: "raydium_observation_state",
				writable: true
			},
			{
				name: "create_pool_fee",
				writable: true,
				address: "DNXgeM9EiiaAbaWvwjHj9fQQLAX5ZsfHyvmYUNRAdNC8"
			},
			{
				name: "mft_mint",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								109,
								102,
								116,
								95,
								109,
								105,
								110,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "token_program",
				address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
			},
			{
				name: "new_token_program"
			},
			{
				name: "associated_token_program",
				address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			},
			{
				name: "rent",
				address: "SysvarRent111111111111111111111111111111111"
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			},
			{
				name: "init_amount_0",
				type: "u64"
			},
			{
				name: "init_amount_1",
				type: "u64"
			}
		]
	},
	{
		name: "create_project",
		discriminator: [
			148,
			219,
			181,
			42,
			221,
			114,
			145,
			190
		],
		accounts: [
			{
				name: "admin",
				writable: true,
				signer: true
			},
			{
				name: "project_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "platform_config",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								108,
								97,
								116,
								102,
								111,
								114,
								109,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						}
					]
				}
			},
			{
				name: "platform_treasury",
				writable: true
			},
			{
				name: "old_token_vault",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								111,
								108,
								100,
								95,
								116,
								111,
								107,
								101,
								110,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "new_token_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								110,
								101,
								119,
								95,
								116,
								111,
								107,
								101,
								110,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "quote_token_vault",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								113,
								117,
								111,
								116,
								101,
								95,
								116,
								111,
								107,
								101,
								110,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "lp_vault",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								108,
								112,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "mft_mint",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								109,
								102,
								116,
								95,
								109,
								105,
								110,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "old_token_mint"
			},
			{
				name: "new_token_mint"
			},
			{
				name: "quote_token_mint"
			},
			{
				name: "source_pool_id"
			},
			{
				name: "source_pool_program"
			},
			{
				name: "old_token_program"
			},
			{
				name: "new_token_program"
			},
			{
				name: "quote_token_program"
			},
			{
				name: "associated_token_program",
				address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			},
			{
				name: "params",
				type: {
					defined: {
						name: "CreateProjectParams"
					}
				}
			}
		]
	},
	{
		name: "deposit_new_tokens",
		discriminator: [
			140,
			243,
			212,
			140,
			193,
			80,
			18,
			93
		],
		accounts: [
			{
				name: "admin",
				writable: true,
				signer: true
			},
			{
				name: "project_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "admin_new_token_ata",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "admin"
						},
						{
							kind: "account",
							path: "new_token_program"
						},
						{
							kind: "account",
							path: "project_config.new_token_mint",
							account: "ProjectConfig"
						}
					],
					program: {
						kind: "const",
						value: [
							140,
							151,
							37,
							143,
							78,
							36,
							137,
							241,
							187,
							61,
							16,
							41,
							20,
							142,
							13,
							131,
							11,
							90,
							19,
							153,
							218,
							255,
							16,
							132,
							4,
							142,
							123,
							216,
							219,
							233,
							248,
							89
						]
					}
				}
			},
			{
				name: "new_token_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								110,
								101,
								119,
								95,
								116,
								111,
								107,
								101,
								110,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "new_token_mint"
			},
			{
				name: "new_token_program"
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			},
			{
				name: "amount",
				type: "u64"
			}
		]
	},
	{
		name: "emergency_withdraw",
		discriminator: [
			239,
			45,
			203,
			64,
			150,
			73,
			218,
			92
		],
		accounts: [
			{
				name: "admin",
				writable: true,
				signer: true
			},
			{
				name: "project_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "old_token_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								111,
								108,
								100,
								95,
								116,
								111,
								107,
								101,
								110,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "new_token_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								110,
								101,
								119,
								95,
								116,
								111,
								107,
								101,
								110,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "wsol_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								113,
								117,
								111,
								116,
								101,
								95,
								116,
								111,
								107,
								101,
								110,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "admin_token_account",
				writable: true
			},
			{
				name: "old_token_mint",
				optional: true
			},
			{
				name: "new_token_mint",
				optional: true
			},
			{
				name: "wsol_mint",
				optional: true
			},
			{
				name: "token_program"
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			},
			{
				name: "token_type",
				type: "u8"
			}
		]
	},
	{
		name: "enable_claims",
		discriminator: [
			56,
			47,
			60,
			155,
			110,
			73,
			10,
			82
		],
		accounts: [
			{
				name: "admin",
				writable: true,
				signer: true
			},
			{
				name: "config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			}
		]
	},
	{
		name: "finalize_swap",
		discriminator: [
			148,
			202,
			88,
			125,
			45,
			237,
			53,
			217
		],
		accounts: [
			{
				name: "admin",
				writable: true,
				signer: true
			},
			{
				name: "project_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "old_token_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								111,
								108,
								100,
								95,
								116,
								111,
								107,
								101,
								110,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "quote_token_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								113,
								117,
								111,
								116,
								101,
								95,
								116,
								111,
								107,
								101,
								110,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "platform_config",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								108,
								97,
								116,
								102,
								111,
								114,
								109,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						}
					]
				}
			},
			{
				name: "platform_fee_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "platform_config"
						},
						{
							kind: "const",
							value: [
								6,
								221,
								246,
								225,
								215,
								101,
								161,
								147,
								217,
								203,
								225,
								70,
								206,
								235,
								121,
								172,
								28,
								180,
								133,
								237,
								95,
								91,
								55,
								145,
								58,
								140,
								245,
								133,
								126,
								255,
								0,
								169
							]
						},
						{
							kind: "account",
							path: "quote_token_mint"
						}
					],
					program: {
						kind: "const",
						value: [
							140,
							151,
							37,
							143,
							78,
							36,
							137,
							241,
							187,
							61,
							16,
							41,
							20,
							142,
							13,
							131,
							11,
							90,
							19,
							153,
							218,
							255,
							16,
							132,
							4,
							142,
							123,
							216,
							219,
							233,
							248,
							89
						]
					}
				}
			},
			{
				name: "quote_token_mint"
			},
			{
				name: "old_token_mint"
			},
			{
				name: "old_token_program"
			},
			{
				name: "quote_token_program"
			},
			{
				name: "token_program",
				address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
			},
			{
				name: "associated_token_program",
				address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			},
			{
				name: "minimum_amount_out",
				type: "u64"
			},
			{
				name: "swap_percentage",
				type: {
					option: "u8"
				}
			}
		]
	},
	{
		name: "initialize_platform",
		discriminator: [
			119,
			201,
			101,
			45,
			75,
			122,
			89,
			3
		],
		accounts: [
			{
				name: "admin",
				writable: true,
				signer: true
			},
			{
				name: "platform_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								108,
								97,
								116,
								102,
								111,
								114,
								109,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						}
					]
				}
			},
			{
				name: "treasury",
				writable: true
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			}
		],
		args: [
			{
				name: "default_fee_basis_points",
				type: "u16"
			},
			{
				name: "project_creation_fee",
				type: "u64"
			}
		]
	},
	{
		name: "initialize_project",
		discriminator: [
			69,
			126,
			215,
			37,
			20,
			60,
			73,
			235
		],
		accounts: [
			{
				name: "admin",
				writable: true,
				signer: true
			},
			{
				name: "project_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "old_token_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								111,
								108,
								100,
								95,
								116,
								111,
								107,
								101,
								110,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "quote_token_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								113,
								117,
								111,
								116,
								101,
								95,
								116,
								111,
								107,
								101,
								110,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "mft_mint",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								109,
								102,
								116,
								95,
								109,
								105,
								110,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "metadata_account",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								109,
								101,
								116,
								97,
								100,
								97,
								116,
								97
							]
						},
						{
							kind: "account",
							path: "token_metadata_program"
						},
						{
							kind: "account",
							path: "mft_mint"
						}
					],
					program: {
						kind: "account",
						path: "token_metadata_program"
					}
				}
			},
			{
				name: "old_token_mint"
			},
			{
				name: "quote_token_mint"
			},
			{
				name: "old_token_program"
			},
			{
				name: "quote_token_program"
			},
			{
				name: "token_program",
				address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
			},
			{
				name: "associated_token_program",
				address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
			},
			{
				name: "token_metadata_program",
				address: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			},
			{
				name: "rent",
				address: "SysvarRent111111111111111111111111111111111"
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			}
		]
	},
	{
		name: "lock_admin_portion",
		discriminator: [
			3,
			178,
			114,
			147,
			42,
			176,
			61,
			41
		],
		accounts: [
			{
				name: "admin",
				writable: true,
				signer: true
			},
			{
				name: "project_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "pool_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								111,
								111,
								108,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "locking_program",
				address: "LockrWmn6K5twhz3y9w1dQERbmgSaRkfnTeTKbpofwE"
			},
			{
				name: "admin_fee_nft_mint",
				writable: true,
				signer: true
			},
			{
				name: "token_program",
				address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
			},
			{
				name: "associated_token_program",
				address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
			},
			{
				name: "metadata_program",
				address: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			},
			{
				name: "rent",
				address: "SysvarRent111111111111111111111111111111111"
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			}
		]
	},
	{
		name: "lock_bonk_fun_portion",
		discriminator: [
			227,
			184,
			213,
			217,
			1,
			53,
			5,
			222
		],
		accounts: [
			{
				name: "admin",
				writable: true,
				signer: true
			},
			{
				name: "project_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "pool_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								111,
								111,
								108,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "locking_program",
				address: "LockrWmn6K5twhz3y9w1dQERbmgSaRkfnTeTKbpofwE"
			},
			{
				name: "bonk_fun_fee_nft_mint",
				writable: true,
				signer: true
			},
			{
				name: "token_program",
				address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
			},
			{
				name: "associated_token_program",
				address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
			},
			{
				name: "metadata_program",
				address: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			},
			{
				name: "rent",
				address: "SysvarRent111111111111111111111111111111111"
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			}
		]
	},
	{
		name: "lock_lp_from_vault",
		discriminator: [
			18,
			185,
			26,
			145,
			206,
			63,
			88,
			11
		],
		accounts: [
			{
				name: "admin",
				writable: true,
				signer: true
			},
			{
				name: "project_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "pool_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								111,
								111,
								108,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "lp_mint"
			},
			{
				name: "lp_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								108,
								112,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "admin_lp_ata",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "admin"
						},
						{
							kind: "const",
							value: [
								6,
								221,
								246,
								225,
								215,
								101,
								161,
								147,
								217,
								203,
								225,
								70,
								206,
								235,
								121,
								172,
								28,
								180,
								133,
								237,
								95,
								91,
								55,
								145,
								58,
								140,
								245,
								133,
								126,
								255,
								0,
								169
							]
						},
						{
							kind: "account",
							path: "lp_mint"
						}
					],
					program: {
						kind: "const",
						value: [
							140,
							151,
							37,
							143,
							78,
							36,
							137,
							241,
							187,
							61,
							16,
							41,
							20,
							142,
							13,
							131,
							11,
							90,
							19,
							153,
							218,
							255,
							16,
							132,
							4,
							142,
							123,
							216,
							219,
							233,
							248,
							89
						]
					}
				}
			},
			{
				name: "streamflow_program"
			},
			{
				name: "streamflow_metadata",
				docs: [
					"Must be a signer - StreamFlow requires this to be a fresh keypair"
				],
				writable: true,
				signer: true
			},
			{
				name: "streamflow_escrow",
				writable: true
			},
			{
				name: "streamflow_treasury",
				writable: true
			},
			{
				name: "streamflow_treasury_tokens",
				writable: true
			},
			{
				name: "streamflow_fee_oracle"
			},
			{
				name: "streamflow_withdrawor",
				writable: true
			},
			{
				name: "token_program",
				address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
			},
			{
				name: "associated_token_program",
				address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			},
			{
				name: "rent",
				address: "SysvarRent111111111111111111111111111111111"
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			}
		]
	},
	{
		name: "mark_token_created",
		discriminator: [
			222,
			248,
			124,
			133,
			151,
			167,
			195,
			234
		],
		accounts: [
			{
				name: "admin",
				writable: true,
				signer: true,
				relations: [
					"project_config"
				]
			},
			{
				name: "project_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			}
		]
	},
	{
		name: "migrate",
		discriminator: [
			155,
			234,
			231,
			146,
			236,
			158,
			162,
			30
		],
		accounts: [
			{
				name: "user",
				writable: true,
				signer: true
			},
			{
				name: "project_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "user_old_token_ata",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "user"
						},
						{
							kind: "account",
							path: "old_token_program"
						},
						{
							kind: "account",
							path: "project_config.old_token_mint",
							account: "ProjectConfig"
						}
					],
					program: {
						kind: "const",
						value: [
							140,
							151,
							37,
							143,
							78,
							36,
							137,
							241,
							187,
							61,
							16,
							41,
							20,
							142,
							13,
							131,
							11,
							90,
							19,
							153,
							218,
							255,
							16,
							132,
							4,
							142,
							123,
							216,
							219,
							233,
							248,
							89
						]
					}
				}
			},
			{
				name: "user_mft_ata",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "user"
						},
						{
							kind: "account",
							path: "token_program"
						},
						{
							kind: "account",
							path: "mft_mint"
						}
					],
					program: {
						kind: "const",
						value: [
							140,
							151,
							37,
							143,
							78,
							36,
							137,
							241,
							187,
							61,
							16,
							41,
							20,
							142,
							13,
							131,
							11,
							90,
							19,
							153,
							218,
							255,
							16,
							132,
							4,
							142,
							123,
							216,
							219,
							233,
							248,
							89
						]
					}
				}
			},
			{
				name: "old_token_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								111,
								108,
								100,
								95,
								116,
								111,
								107,
								101,
								110,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "old_token_mint"
			},
			{
				name: "mft_mint",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								109,
								102,
								116,
								95,
								109,
								105,
								110,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "user_migration",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								117,
								115,
								101,
								114,
								95,
								109,
								105,
								103,
								114,
								97,
								116,
								105,
								111,
								110
							]
						},
						{
							kind: "arg",
							path: "project_id"
						},
						{
							kind: "account",
							path: "user"
						}
					]
				}
			},
			{
				name: "old_token_program"
			},
			{
				name: "token_program",
				address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
			},
			{
				name: "associated_token_program",
				address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			},
			{
				name: "amount",
				type: "u64"
			}
		]
	},
	{
		name: "pause_project",
		discriminator: [
			8,
			68,
			240,
			82,
			45,
			162,
			129,
			230
		],
		accounts: [
			{
				name: "admin",
				writable: true,
				signer: true
			},
			{
				name: "project_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			},
			{
				name: "pause",
				type: "bool"
			}
		]
	},
	{
		name: "recover_unclaimed",
		discriminator: [
			145,
			250,
			67,
			46,
			166,
			179,
			123,
			166
		],
		accounts: [
			{
				name: "admin",
				writable: true,
				signer: true
			},
			{
				name: "project_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "pool_config"
			},
			{
				name: "old_token_vault",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								111,
								108,
								100,
								95,
								116,
								111,
								107,
								101,
								110,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "new_token_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								110,
								101,
								119,
								95,
								116,
								111,
								107,
								101,
								110,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "quote_token_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								113,
								117,
								111,
								116,
								101,
								95,
								116,
								111,
								107,
								101,
								110,
								95,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "new_token_mint"
			},
			{
				name: "quote_token_mint"
			},
			{
				name: "admin_new_token_ata",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "admin"
						},
						{
							kind: "account",
							path: "new_token_program"
						},
						{
							kind: "account",
							path: "new_token_mint"
						}
					],
					program: {
						kind: "const",
						value: [
							140,
							151,
							37,
							143,
							78,
							36,
							137,
							241,
							187,
							61,
							16,
							41,
							20,
							142,
							13,
							131,
							11,
							90,
							19,
							153,
							218,
							255,
							16,
							132,
							4,
							142,
							123,
							216,
							219,
							233,
							248,
							89
						]
					}
				}
			},
			{
				name: "admin_quote_token_ata",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "admin"
						},
						{
							kind: "account",
							path: "quote_token_program"
						},
						{
							kind: "account",
							path: "quote_token_mint"
						}
					],
					program: {
						kind: "const",
						value: [
							140,
							151,
							37,
							143,
							78,
							36,
							137,
							241,
							187,
							61,
							16,
							41,
							20,
							142,
							13,
							131,
							11,
							90,
							19,
							153,
							218,
							255,
							16,
							132,
							4,
							142,
							123,
							216,
							219,
							233,
							248,
							89
						]
					}
				}
			},
			{
				name: "new_token_program"
			},
			{
				name: "quote_token_program"
			},
			{
				name: "associated_token_program",
				address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			}
		]
	},
	{
		name: "set_merkle_root",
		discriminator: [
			43,
			24,
			91,
			60,
			240,
			137,
			28,
			102
		],
		accounts: [
			{
				name: "admin",
				writable: true,
				signer: true
			},
			{
				name: "config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			},
			{
				name: "merkle_root",
				type: {
					array: [
						"u8",
						32
					]
				}
			},
			{
				name: "merkle_allocation",
				type: "u64"
			}
		]
	},
	{
		name: "toggle_project_emergency_withdraw",
		discriminator: [
			167,
			126,
			170,
			252,
			248,
			123,
			88,
			46
		],
		accounts: [
			{
				name: "platform_admin",
				writable: true,
				signer: true
			},
			{
				name: "platform_config",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								108,
								97,
								116,
								102,
								111,
								114,
								109,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						}
					]
				}
			},
			{
				name: "project_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			},
			{
				name: "enabled",
				type: "bool"
			}
		]
	},
	{
		name: "update_fee",
		discriminator: [
			232,
			253,
			195,
			247,
			148,
			212,
			73,
			222
		],
		accounts: [
			{
				name: "platform_config",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								108,
								97,
								116,
								102,
								111,
								114,
								109,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						}
					]
				}
			},
			{
				name: "platform_admin",
				signer: true
			},
			{
				name: "project_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			},
			{
				name: "new_fee_basis_points",
				type: "u16"
			}
		]
	},
	{
		name: "update_platform_config",
		discriminator: [
			195,
			60,
			76,
			129,
			146,
			45,
			67,
			143
		],
		accounts: [
			{
				name: "platform_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								108,
								97,
								116,
								102,
								111,
								114,
								109,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						}
					]
				}
			},
			{
				name: "admin",
				signer: true
			},
			{
				name: "new_treasury_account"
			}
		],
		args: [
			{
				name: "new_admin",
				type: {
					option: "pubkey"
				}
			},
			{
				name: "new_treasury",
				type: {
					option: "pubkey"
				}
			},
			{
				name: "new_default_fee_basis_points",
				type: {
					option: "u16"
				}
			},
			{
				name: "new_project_creation_fee",
				type: {
					option: "u64"
				}
			},
			{
				name: "new_is_paused",
				type: {
					option: "bool"
				}
			}
		]
	},
	{
		name: "verify_lp_lock",
		discriminator: [
			164,
			33,
			234,
			53,
			111,
			225,
			13,
			220
		],
		accounts: [
			{
				name: "admin",
				writable: true,
				signer: true
			},
			{
				name: "project_config",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								114,
								111,
								106,
								101,
								99,
								116,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "pool_config",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								111,
								111,
								108,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "arg",
							path: "project_id"
						}
					]
				}
			},
			{
				name: "streamflow_metadata"
			},
			{
				name: "streamflow_program"
			}
		],
		args: [
			{
				name: "project_id",
				type: "string"
			}
		]
	}
];
var accounts = [
	{
		name: "PlatformConfig",
		discriminator: [
			160,
			78,
			128,
			0,
			248,
			83,
			230,
			160
		]
	},
	{
		name: "PoolConfig",
		discriminator: [
			26,
			108,
			14,
			123,
			116,
			230,
			129,
			43
		]
	},
	{
		name: "ProjectConfig",
		discriminator: [
			187,
			239,
			0,
			110,
			5,
			15,
			245,
			65
		]
	},
	{
		name: "UserMerkleClaim",
		discriminator: [
			186,
			112,
			216,
			254,
			119,
			63,
			93,
			26
		]
	},
	{
		name: "UserMigration",
		discriminator: [
			219,
			194,
			245,
			85,
			15,
			214,
			204,
			163
		]
	}
];
var events = [
	{
		name: "AdminLpLocked",
		discriminator: [
			193,
			201,
			47,
			36,
			204,
			224,
			59,
			6
		]
	},
	{
		name: "BonkFunLpLocked",
		discriminator: [
			20,
			73,
			36,
			53,
			20,
			133,
			127,
			30
		]
	},
	{
		name: "ClaimsEnabled",
		discriminator: [
			27,
			116,
			118,
			179,
			171,
			8,
			66,
			137
		]
	},
	{
		name: "CommitmentSet",
		discriminator: [
			245,
			41,
			85,
			83,
			205,
			224,
			0,
			143
		]
	},
	{
		name: "CommitmentToppedUp",
		discriminator: [
			227,
			116,
			148,
			84,
			22,
			51,
			244,
			93
		]
	},
	{
		name: "CpmmPoolCreated",
		discriminator: [
			238,
			103,
			157,
			230,
			65,
			143,
			8,
			79
		]
	},
	{
		name: "EmergencyWithdrawEvent",
		discriminator: [
			177,
			61,
			254,
			20,
			145,
			18,
			188,
			237
		]
	},
	{
		name: "ErrorOccurred",
		discriminator: [
			45,
			168,
			251,
			0,
			254,
			251,
			21,
			128
		]
	},
	{
		name: "FailedMigrationFinalized",
		discriminator: [
			192,
			62,
			91,
			253,
			252,
			62,
			83,
			165
		]
	},
	{
		name: "FailedMigrationSolClaimed",
		discriminator: [
			192,
			199,
			24,
			10,
			167,
			85,
			91,
			108
		]
	},
	{
		name: "LpBurned",
		discriminator: [
			7,
			184,
			215,
			76,
			200,
			54,
			6,
			56
		]
	},
	{
		name: "LpLockVerified",
		discriminator: [
			210,
			22,
			111,
			138,
			195,
			157,
			212,
			18
		]
	},
	{
		name: "LpTokensClaimed",
		discriminator: [
			238,
			34,
			104,
			0,
			111,
			229,
			74,
			213
		]
	},
	{
		name: "LpTokensLockedEvent",
		discriminator: [
			70,
			53,
			97,
			39,
			58,
			231,
			247,
			120
		]
	},
	{
		name: "LpTokensLockedWithStreamflow",
		discriminator: [
			234,
			148,
			130,
			141,
			225,
			66,
			122,
			46
		]
	},
	{
		name: "MerkleClaimed",
		discriminator: [
			77,
			94,
			88,
			168,
			214,
			30,
			68,
			0
		]
	},
	{
		name: "MerkleRootSet",
		discriminator: [
			71,
			89,
			215,
			23,
			123,
			11,
			135,
			16
		]
	},
	{
		name: "MftClaimed",
		discriminator: [
			154,
			250,
			129,
			96,
			101,
			241,
			0,
			122
		]
	},
	{
		name: "MigrationEvent",
		discriminator: [
			255,
			202,
			76,
			147,
			91,
			231,
			73,
			22
		]
	},
	{
		name: "MigrationFailed",
		discriminator: [
			134,
			211,
			211,
			164,
			161,
			159,
			212,
			139
		]
	},
	{
		name: "MigrationFailureDeclared",
		discriminator: [
			92,
			115,
			82,
			220,
			207,
			115,
			85,
			140
		]
	},
	{
		name: "MigrationSucceeded",
		discriminator: [
			216,
			199,
			203,
			122,
			112,
			232,
			183,
			14
		]
	},
	{
		name: "MigrationSucceededEarly",
		discriminator: [
			213,
			192,
			145,
			53,
			110,
			181,
			76,
			123
		]
	},
	{
		name: "NewTokensDeposited",
		discriminator: [
			15,
			104,
			21,
			168,
			240,
			171,
			155,
			89
		]
	},
	{
		name: "PartialSwapEvent",
		discriminator: [
			121,
			231,
			249,
			10,
			235,
			136,
			126,
			205
		]
	},
	{
		name: "PlatformConfigUpdated",
		discriminator: [
			198,
			206,
			187,
			204,
			148,
			251,
			237,
			25
		]
	},
	{
		name: "PlatformFeesClaimedEvent",
		discriminator: [
			253,
			217,
			84,
			147,
			249,
			44,
			26,
			35
		]
	},
	{
		name: "PlatformInitialized",
		discriminator: [
			16,
			222,
			212,
			5,
			213,
			140,
			112,
			162
		]
	},
	{
		name: "ProjectCreatedEvent",
		discriminator: [
			211,
			119,
			21,
			209,
			113,
			178,
			141,
			38
		]
	},
	{
		name: "ProjectCreationFeeCollected",
		discriminator: [
			88,
			9,
			14,
			213,
			25,
			213,
			28,
			118
		]
	},
	{
		name: "ProjectEmergencyWithdrawToggled",
		discriminator: [
			195,
			54,
			114,
			114,
			143,
			222,
			164,
			67
		]
	},
	{
		name: "ProjectFeeUpdated",
		discriminator: [
			49,
			83,
			247,
			111,
			97,
			41,
			250,
			81
		]
	},
	{
		name: "ProjectFinalized",
		discriminator: [
			206,
			140,
			138,
			3,
			23,
			210,
			23,
			204
		]
	},
	{
		name: "ProjectInitialized",
		discriminator: [
			222,
			194,
			81,
			9,
			16,
			183,
			224,
			22
		]
	},
	{
		name: "ProjectInitializedEvent",
		discriminator: [
			199,
			63,
			149,
			189,
			143,
			15,
			56,
			253
		]
	},
	{
		name: "ProjectPaused",
		discriminator: [
			126,
			250,
			145,
			29,
			201,
			145,
			236,
			173
		]
	},
	{
		name: "RefundClaimed",
		discriminator: [
			136,
			64,
			242,
			99,
			4,
			244,
			208,
			130
		]
	},
	{
		name: "SolRefundClaimed",
		discriminator: [
			184,
			234,
			43,
			249,
			123,
			73,
			253,
			176
		]
	},
	{
		name: "SwapWarning",
		discriminator: [
			193,
			56,
			83,
			255,
			91,
			236,
			18,
			49
		]
	},
	{
		name: "TokenMarkedAsCreated",
		discriminator: [
			96,
			236,
			103,
			52,
			129,
			34,
			221,
			41
		]
	},
	{
		name: "TokenMigrated",
		discriminator: [
			109,
			61,
			145,
			107,
			50,
			158,
			28,
			154
		]
	},
	{
		name: "TokenSwappedToQuote",
		discriminator: [
			247,
			7,
			255,
			108,
			157,
			48,
			140,
			19
		]
	},
	{
		name: "TransferredToClaims",
		discriminator: [
			5,
			238,
			85,
			97,
			140,
			132,
			252,
			47
		]
	},
	{
		name: "UnclaimedAssetsRecovered",
		discriminator: [
			42,
			183,
			43,
			222,
			11,
			234,
			142,
			46
		]
	},
	{
		name: "UnclaimedFailureRecovered",
		discriminator: [
			129,
			54,
			143,
			170,
			57,
			120,
			102,
			5
		]
	}
];
var errors = [
	{
		code: 6000,
		name: "MigrationWindowClosed",
		msg: "Migration windows has closed"
	},
	{
		code: 6001,
		name: "MigrationNotEnded",
		msg: "Migration period has not ended yet"
	},
	{
		code: 6002,
		name: "MigrationAlreadyStarted",
		msg: "Migration has already started"
	},
	{
		code: 6003,
		name: "AlreadyFinalized",
		msg: "Migration already finalized"
	},
	{
		code: 6004,
		name: "CannotFinalizeEarly",
		msg: "Cannot finalize before migration end"
	},
	{
		code: 6005,
		name: "AlreadyEvaluated",
		msg: "Migration has already been evaluated"
	},
	{
		code: 6006,
		name: "NoMigration",
		msg: "No migration"
	},
	{
		code: 6007,
		name: "MigrationNotEvaluated",
		msg: "Migration has not been evaluated yet"
	},
	{
		code: 6008,
		name: "MigrationFailed",
		msg: "Migration failed - tokens will be refunded"
	},
	{
		code: 6009,
		name: "InvalidProjectId",
		msg: "Invalid project ID - must be lowercase, <= 16 chars, no spaces"
	},
	{
		code: 6010,
		name: "InvalidProjectName",
		msg: "Invalid project name - must be <= 32 characters"
	},
	{
		code: 6011,
		name: "ProjectNotInitialized",
		msg: "Project not initialized"
	},
	{
		code: 6012,
		name: "ProjectAlreadyExists",
		msg: "Project already exists"
	},
	{
		code: 6013,
		name: "ProjectNotFinalized",
		msg: "Project has not been finalized"
	},
	{
		code: 6014,
		name: "ProjectIdMismatch",
		msg: "Project ID mismatch"
	},
	{
		code: 6015,
		name: "ProjectPaused",
		msg: "Project is paused - migrations are temporarily disabled"
	},
	{
		code: 6016,
		name: "ProjectFinalized",
		msg: "Project is finalized"
	},
	{
		code: 6017,
		name: "ProjectNotActive",
		msg: "Project not active"
	},
	{
		code: 6018,
		name: "InvalidProject",
		msg: "Invalid project"
	},
	{
		code: 6019,
		name: "InvalidTimeRange",
		msg: "Invalid time range configuration"
	},
	{
		code: 6020,
		name: "DeadlineNotReached",
		msg: "Deadline not reached"
	},
	{
		code: 6021,
		name: "DeadlineReached",
		msg: "Deadline has been reached - use evaluate instead"
	},
	{
		code: 6022,
		name: "RecoveryPeriodNotReached",
		msg: "Recovery period has not been reached"
	},
	{
		code: 6023,
		name: "UnclaimedRecoveryNotStarted",
		msg: "Unclaimed recovery period has not started"
	},
	{
		code: 6024,
		name: "InvalidAdmin",
		msg: "Invalid admin"
	},
	{
		code: 6025,
		name: "UnauthorizedAdmin",
		msg: "Unauthorized admin"
	},
	{
		code: 6026,
		name: "InvalidPlatformAdmin",
		msg: "Invalid platform admin"
	},
	{
		code: 6027,
		name: "InvalidUser",
		msg: "Invalid user"
	},
	{
		code: 6028,
		name: "PlatformPaused",
		msg: "Platform is paused"
	},
	{
		code: 6029,
		name: "VaultNotEmpty",
		msg: "Vault is not empty - contains LP tokens"
	},
	{
		code: 6030,
		name: "InvalidVaultAddress",
		msg: "Invalid vault address"
	},
	{
		code: 6031,
		name: "InvalidVault",
		msg: "Invalid vault"
	},
	{
		code: 6032,
		name: "VaultsNotInitialized",
		msg: "Vaults not initialized"
	},
	{
		code: 6033,
		name: "InvalidVaultOwner",
		msg: "Invalid vault owner"
	},
	{
		code: 6034,
		name: "InsufficientVaultBalance",
		msg: "Insufficient vault balance"
	},
	{
		code: 6035,
		name: "NoTokensToSwap",
		msg: "No tokens available to swap"
	},
	{
		code: 6036,
		name: "TokensAlreadyDeposited",
		msg: "New tokens have already been deposited"
	},
	{
		code: 6037,
		name: "InvalidDepositAmount",
		msg: "Invalid deposit amount"
	},
	{
		code: 6038,
		name: "InvalidDecimals",
		msg: "Invalid decimal places - must be 9 or less"
	},
	{
		code: 6039,
		name: "InvalidMintOwner",
		msg: "Invalid mint owner - must be Token or Token-2022 program"
	},
	{
		code: 6040,
		name: "InvalidTokenProgram",
		msg: "Invalid token program"
	},
	{
		code: 6041,
		name: "InvalidSourcePoolProgram",
		msg: "Invalid source pool program"
	},
	{
		code: 6042,
		name: "InvalidSourcePoolId",
		msg: "Invalid source pool ID - pool account must be owned by the source pool program"
	},
	{
		code: 6043,
		name: "OldAndNewMintCannotMatch",
		msg: "Old and new token mints cannot be the same"
	},
	{
		code: 6044,
		name: "InvalidTokenAccountOwner",
		msg: "Invalid token account owner"
	},
	{
		code: 6045,
		name: "InvalidMint",
		msg: "Invalid mint"
	},
	{
		code: 6046,
		name: "InvalidProgram",
		msg: "Invalid program ID"
	},
	{
		code: 6047,
		name: "InvalidAccountData",
		msg: "Invalid account data"
	},
	{
		code: 6048,
		name: "InvalidAccountCount",
		msg: "Invalid account count for instruction"
	},
	{
		code: 6049,
		name: "InvalidTokenType",
		msg: "Invalid token type specified"
	},
	{
		code: 6050,
		name: "PoolAlreadyCreated",
		msg: "Pool has already been created"
	},
	{
		code: 6051,
		name: "PoolNotCreated",
		msg: "Pool has not been created yet"
	},
	{
		code: 6052,
		name: "InsufficientLiquidity",
		msg: "Insufficient liquidity for pool creation"
	},
	{
		code: 6053,
		name: "InvalidPoolType",
		msg: "Invalid pool type"
	},
	{
		code: 6054,
		name: "MustUseAllQuoteTokens",
		msg: "Must use all quote tokens (SOL/USDC) from vault for pool creation"
	},
	{
		code: 6055,
		name: "InvalidPoolConfig",
		msg: "Invalid pool config account"
	},
	{
		code: 6056,
		name: "NoLpTokensAvailable",
		msg: "No LP tokens available to claim"
	},
	{
		code: 6057,
		name: "AlreadyClaimed",
		msg: "Already claimed"
	},
	{
		code: 6058,
		name: "ClaimsNotEnabled",
		msg: "Claims are not enabled yet"
	},
	{
		code: 6059,
		name: "ClaimsAlreadyEnabled",
		msg: "Claims are already enabled"
	},
	{
		code: 6060,
		name: "ClaimsExpired",
		msg: "Claims expired"
	},
	{
		code: 6061,
		name: "ClaimsNotExpired",
		msg: "Claims period has not expired - users still have time to claim"
	},
	{
		code: 6062,
		name: "AlreadyRecovered",
		msg: "Assets have already been recovered"
	},
	{
		code: 6063,
		name: "NothingToRecover",
		msg: "No assets available to recover"
	},
	{
		code: 6064,
		name: "InvalidFeeRate",
		msg: "Invalid fee rate"
	},
	{
		code: 6065,
		name: "InsufficientBalance",
		msg: "Insufficient balance to pay project creation fee"
	},
	{
		code: 6066,
		name: "NoFeesToClaim",
		msg: "No fees to claim"
	},
	{
		code: 6067,
		name: "InvalidTreasury",
		msg: "Invalid treasury account"
	},
	{
		code: 6068,
		name: "NoRefundsAvailable",
		msg: "No refunds available"
	},
	{
		code: 6069,
		name: "RefundsExceeded",
		msg: "Total refunds would exceed available funds"
	},
	{
		code: 6070,
		name: "InvalidPercentage",
		msg: "Invalid percentage - must be between 1 and 100"
	},
	{
		code: 6071,
		name: "InvalidTargetPercentage",
		msg: "Invalid target percentage - must be between 1% and 100%"
	},
	{
		code: 6072,
		name: "InvalidHaircut",
		msg: "Invalid haircut percentage - must be <= 100%"
	},
	{
		code: 6073,
		name: "InvalidSupply",
		msg: "Invalid supply - must be greater than 0"
	},
	{
		code: 6074,
		name: "InvalidAmount",
		msg: "Invalid amount"
	},
	{
		code: 6075,
		name: "AmountTooSmall",
		msg: "Migration amount too small - would result in 0 MFT tokens due to precision loss"
	},
	{
		code: 6076,
		name: "TargetNotReached",
		msg: "Target percentage not reached"
	},
	{
		code: 6077,
		name: "InvalidExchangeRate",
		msg: "Invalid exchange rate - must be > 0 and <= 10,000,000 basis points (1,000x)"
	},
	{
		code: 6078,
		name: "InvalidStreamflowContract",
		msg: "Invalid Streamflow contract"
	},
	{
		code: 6079,
		name: "InvalidLockDuration",
		msg: "Invalid lock duration"
	},
	{
		code: 6080,
		name: "AlreadyVerified",
		msg: "Lock already verified"
	},
	{
		code: 6081,
		name: "MissingBonkFunRecipient",
		msg: "Missing BONK.fun recipient address"
	},
	{
		code: 6082,
		name: "InvalidBonkFunPercentage",
		msg: "Invalid BONK.fun percentage - must be between 50% and 95%"
	},
	{
		code: 6083,
		name: "InvalidBonkFunRecipient",
		msg: "Invalid BONK.fun recipient address"
	},
	{
		code: 6084,
		name: "MerkleRootAlreadySet",
		msg: "Merkle root already set"
	},
	{
		code: 6085,
		name: "MerkleRootNotSet",
		msg: "Merkle root not set"
	},
	{
		code: 6086,
		name: "InvalidMerkleProof",
		msg: "Invalid merkle proof"
	},
	{
		code: 6087,
		name: "Overflow",
		msg: "Calculation overflow"
	},
	{
		code: 6088,
		name: "Underflow",
		msg: "Calculation underflow"
	},
	{
		code: 6089,
		name: "MathOverflow",
		msg: "Math overflow in calculation"
	},
	{
		code: 6090,
		name: "InsufficientAccounts",
		msg: "Insufficient accounts provided for instruction"
	},
	{
		code: 6091,
		name: "InvalidRemainingAccounts",
		msg: "Invalid remaining accounts provided"
	},
	{
		code: 6092,
		name: "InvalidOperation",
		msg: "Invalid operation"
	},
	{
		code: 6093,
		name: "TransferFailed",
		msg: "Transfer failed"
	},
	{
		code: 6094,
		name: "EmergencyWithdrawDisabled",
		msg: "Emergency withdraw is disabled for this protected migration"
	},
	{
		code: 6095,
		name: "EmergencyWithdrawNotAllowed",
		msg: "Emergency withdraw requires project to be paused or migration period to be ended"
	},
	{
		code: 6096,
		name: "InvalidOwner",
		msg: "Invalid owner of account"
	},
	{
		code: 6097,
		name: "NotImplemented",
		msg: "Not implemented"
	}
];
var types = [
	{
		name: "AdminLpLocked",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "admin",
					type: "pubkey"
				},
				{
					name: "nft_mint",
					type: "pubkey"
				},
				{
					name: "amount",
					type: "u64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "BonkFunLpLocked",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "bonk_fun_recipient",
					type: "pubkey"
				},
				{
					name: "nft_mint",
					type: "pubkey"
				},
				{
					name: "bonk_fun_amount",
					type: "u64"
				},
				{
					name: "admin_amount",
					type: "u64"
				},
				{
					name: "admin_nft_mint",
					type: "pubkey"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "ClaimsEnabled",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "CommitmentSet",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "committed_sol_percentage",
					type: "u8"
				},
				{
					name: "minimum_sol_amount",
					type: "u64"
				},
				{
					name: "committed_pool_deadline_days",
					type: "u8"
				},
				{
					name: "deadline_ts",
					type: "i64"
				}
			]
		}
	},
	{
		name: "CommitmentToppedUp",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "admin",
					type: "pubkey"
				},
				{
					name: "extracted_sol",
					type: "u64"
				},
				{
					name: "required_sol",
					type: "u64"
				},
				{
					name: "topped_up_amount",
					type: "u64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "CpmmPoolCreated",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "pool_address",
					type: "pubkey"
				},
				{
					name: "lp_mint",
					type: "pubkey"
				},
				{
					name: "quote_amount",
					type: "u64"
				},
				{
					name: "new_token_amount",
					type: "u64"
				},
				{
					name: "lp_tokens_received",
					type: "u64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "CreateProjectParams",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_name",
					type: "string"
				},
				{
					name: "start_ts",
					type: "i64"
				},
				{
					name: "end_ts",
					type: "i64"
				},
				{
					name: "source_pool_type",
					type: {
						defined: {
							name: "SourcePoolType"
						}
					}
				},
				{
					name: "protection_params",
					type: {
						option: {
							defined: {
								name: "ProtectionParams"
							}
						}
					}
				},
				{
					name: "exchange_rate_basis_points",
					type: {
						option: "u32"
					}
				},
				{
					name: "output_pool_type",
					type: {
						option: {
							defined: {
								name: "OutputPoolType"
							}
						}
					}
				}
			]
		}
	},
	{
		name: "EmergencyWithdrawEvent",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "admin",
					type: "pubkey"
				},
				{
					name: "token_type",
					type: "u8"
				},
				{
					name: "amount",
					type: "u64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "ErrorOccurred",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "error_code",
					type: "u32"
				},
				{
					name: "error_msg",
					type: "string"
				},
				{
					name: "instruction",
					type: "string"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "FailedMigrationFinalized",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "no_swap_executed",
					type: "bool"
				},
				{
					name: "sol_available_for_refunds",
					type: "u64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "FailedMigrationSolClaimed",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "user",
					type: "pubkey"
				},
				{
					name: "amount_claimed",
					type: "u64"
				},
				{
					name: "user_tokens_migrated",
					type: "u64"
				},
				{
					name: "total_distributed",
					type: "u64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "LpBurned",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "burn_amount",
					type: "u64"
				},
				{
					name: "total_lp_amount",
					type: "u64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "LpLockVerified",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "streamflow_contract",
					type: "pubkey"
				},
				{
					name: "recipient",
					type: "pubkey"
				},
				{
					name: "amount",
					type: "u64"
				},
				{
					name: "unlock_timestamp",
					type: "i64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "LpTokensClaimed",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "admin",
					type: "pubkey"
				},
				{
					name: "lp_amount",
					type: "u64"
				},
				{
					name: "claimed_at",
					type: "i64"
				}
			]
		}
	},
	{
		name: "LpTokensLockedEvent",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "amount",
					type: "u64"
				},
				{
					name: "lock_duration_days",
					type: "u64"
				},
				{
					name: "unlock_timestamp",
					type: "i64"
				},
				{
					name: "streamflow_contract",
					type: "pubkey"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "LpTokensLockedWithStreamflow",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "streamflow_contract",
					type: "pubkey"
				},
				{
					name: "amount",
					type: "u64"
				},
				{
					name: "lock_duration_days",
					type: "u64"
				},
				{
					name: "unlock_timestamp",
					type: "i64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "MerkleClaimed",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "user",
					type: "pubkey"
				},
				{
					name: "amount",
					type: "u64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "MerkleRootSet",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "merkle_root",
					type: {
						array: [
							"u8",
							32
						]
					}
				},
				{
					name: "merkle_allocation",
					type: "u64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "MftClaimed",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "user",
					type: "pubkey"
				},
				{
					name: "mft_burned",
					type: "u64"
				},
				{
					name: "new_tokens_received",
					type: "u64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "MigrationEvent",
		type: {
			kind: "struct",
			fields: [
				{
					name: "user",
					type: "pubkey"
				},
				{
					name: "tnsr_in",
					type: "u64"
				},
				{
					name: "hustle_out",
					type: "u64"
				},
				{
					name: "ts",
					type: "i64"
				}
			]
		}
	},
	{
		name: "MigrationFailed",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "final_percentage",
					type: "u16"
				},
				{
					name: "target_percentage",
					type: "u16"
				},
				{
					name: "total_migrated",
					type: "u64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "MigrationFailureDeclared",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "total_sol",
					type: "u64"
				},
				{
					name: "total_tokens",
					type: "u64"
				},
				{
					name: "deadline_missed_ts",
					type: "i64"
				},
				{
					name: "declared_at",
					type: "i64"
				}
			]
		}
	},
	{
		name: "MigrationSucceeded",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "final_percentage",
					type: "u16"
				},
				{
					name: "total_migrated",
					type: "u64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "MigrationSucceededEarly",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "final_percentage",
					type: "u16"
				},
				{
					name: "days_before_deadline",
					type: "i64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "NewTokensDeposited",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "amount",
					type: "u64"
				},
				{
					name: "admin",
					type: "pubkey"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "OutputPoolType",
		type: {
			kind: "enum",
			variants: [
				{
					name: "RaydiumCPMM"
				},
				{
					name: "RaydiumCPMMBonkFunMeme"
				},
				{
					name: "RaydiumCPMMBonkFunTech"
				}
			]
		}
	},
	{
		name: "PartialSwapEvent",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "amount_swapped",
					type: "u64"
				},
				{
					name: "quote_received",
					type: "u64"
				},
				{
					name: "remaining_balance",
					type: "u64"
				},
				{
					name: "is_finalized",
					type: "bool"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "PlatformConfig",
		type: {
			kind: "struct",
			fields: [
				{
					name: "admin",
					type: "pubkey"
				},
				{
					name: "treasury",
					type: "pubkey"
				},
				{
					name: "default_fee_basis_points",
					type: "u16"
				},
				{
					name: "project_creation_fee",
					type: "u64"
				},
				{
					name: "is_paused",
					type: "bool"
				},
				{
					name: "bump",
					type: "u8"
				}
			]
		}
	},
	{
		name: "PlatformConfigUpdated",
		type: {
			kind: "struct",
			fields: [
				{
					name: "admin",
					type: "pubkey"
				},
				{
					name: "new_admin",
					type: {
						option: "pubkey"
					}
				},
				{
					name: "new_treasury",
					type: {
						option: "pubkey"
					}
				},
				{
					name: "new_default_fee",
					type: {
						option: "u16"
					}
				},
				{
					name: "new_creation_fee",
					type: {
						option: "u64"
					}
				},
				{
					name: "is_paused",
					type: {
						option: "bool"
					}
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "PlatformFeesClaimedEvent",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "amount",
					type: "u64"
				},
				{
					name: "treasury",
					type: "pubkey"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "PlatformInitialized",
		type: {
			kind: "struct",
			fields: [
				{
					name: "admin",
					type: "pubkey"
				},
				{
					name: "treasury",
					type: "pubkey"
				},
				{
					name: "default_fee_basis_points",
					type: "u16"
				},
				{
					name: "project_creation_fee",
					type: "u64"
				}
			]
		}
	},
	{
		name: "PoolConfig",
		docs: [
			"Separate account to store CPMM pool configuration",
			"This avoids stack overflow issues in the main ProjectConfig"
		],
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "raydium_cpmm_program",
					type: "pubkey"
				},
				{
					name: "raydium_cpmm_config",
					type: "pubkey"
				},
				{
					name: "raydium_cpmm_pool",
					type: "pubkey"
				},
				{
					name: "lp_mint",
					type: "pubkey"
				},
				{
					name: "lp_vault",
					type: "pubkey"
				},
				{
					name: "pool_created",
					type: "bool"
				},
				{
					name: "pool_creation_ts",
					type: "i64"
				},
				{
					name: "lp_tokens_amount",
					type: "u64"
				},
				{
					name: "lp_locked_amount",
					type: "u64"
				},
				{
					name: "streamflow_metadata_account",
					type: "pubkey"
				},
				{
					name: "lp_lock_duration_days",
					type: "u64"
				},
				{
					name: "bonk_fun_nft_mint",
					type: "pubkey"
				},
				{
					name: "bonk_fun_lp_amount",
					type: "u64"
				},
				{
					name: "admin_lp_amount",
					type: "u64"
				},
				{
					name: "bonk_fun_lock_completed",
					type: "bool"
				},
				{
					name: "admin_nft_mint",
					type: "pubkey"
				},
				{
					name: "burn_lp_amount",
					type: "u64"
				},
				{
					name: "burn_lock_completed",
					type: "bool"
				},
				{
					name: "bump",
					type: "u8"
				}
			]
		}
	},
	{
		name: "ProjectConfig",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "project_name",
					type: "string"
				},
				{
					name: "admin",
					type: "pubkey"
				},
				{
					name: "old_token_mint",
					type: "pubkey"
				},
				{
					name: "new_token_mint",
					type: "pubkey"
				},
				{
					name: "old_token_vault",
					type: "pubkey"
				},
				{
					name: "new_token_vault",
					type: "pubkey"
				},
				{
					name: "quote_token_vault",
					type: "pubkey"
				},
				{
					name: "old_token_program",
					type: "pubkey"
				},
				{
					name: "new_token_program",
					type: "pubkey"
				},
				{
					name: "quote_token_mint",
					type: "pubkey"
				},
				{
					name: "quote_token_program",
					type: "pubkey"
				},
				{
					name: "start_ts",
					type: "i64"
				},
				{
					name: "end_ts",
					type: "i64"
				},
				{
					name: "total_migrated",
					type: "u64"
				},
				{
					name: "fee_basis_points",
					type: "u16"
				},
				{
					name: "exchange_rate_basis_points",
					type: "u32"
				},
				{
					name: "source_pool_type",
					type: {
						defined: {
							name: "SourcePoolType"
						}
					}
				},
				{
					name: "source_pool_id",
					type: "pubkey"
				},
				{
					name: "source_pool_program",
					type: "pubkey"
				},
				{
					name: "output_pool_type",
					type: {
						defined: {
							name: "OutputPoolType"
						}
					}
				},
				{
					name: "is_finalized",
					type: "bool"
				},
				{
					name: "is_paused",
					type: "bool"
				},
				{
					name: "pool_created",
					type: "bool"
				},
				{
					name: "token_created_by_platform",
					type: "bool"
				},
				{
					name: "is_protected",
					type: "bool"
				},
				{
					name: "target_migration_percentage",
					type: "u16"
				},
				{
					name: "total_old_token_supply",
					type: "u64"
				},
				{
					name: "migration_deadline",
					type: "i64"
				},
				{
					name: "migration_succeeded",
					type: "bool"
				},
				{
					name: "migration_failed",
					type: "bool"
				},
				{
					name: "total_old_tokens_swapped",
					type: "u64"
				},
				{
					name: "total_quote_tokens_received",
					type: "u64"
				},
				{
					name: "total_new_tokens_in_pool",
					type: "u64"
				},
				{
					name: "total_quote_tokens_in_pool",
					type: "u64"
				},
				{
					name: "total_refunded",
					type: "u64"
				},
				{
					name: "total_quote_tokens_for_refunds",
					type: "u64"
				},
				{
					name: "unclaimed_fees",
					type: "u64"
				},
				{
					name: "streamflow_contract",
					type: "pubkey"
				},
				{
					name: "lp_locked_externally",
					type: "bool"
				},
				{
					name: "lp_lock_verified",
					type: "bool"
				},
				{
					name: "old_token_decimals",
					type: "u8"
				},
				{
					name: "new_token_decimals",
					type: "u8"
				},
				{
					name: "emergency_withdraw_enabled",
					type: "bool"
				},
				{
					name: "new_tokens_deposited",
					type: "bool"
				},
				{
					name: "late_claim_haircut_bps",
					type: "u16"
				},
				{
					name: "claims_enabled",
					type: "bool"
				},
				{
					name: "merkle_root",
					type: {
						array: [
							"u8",
							32
						]
					}
				},
				{
					name: "vaults_initialized",
					type: "bool"
				},
				{
					name: "has_recovered",
					type: "bool"
				},
				{
					name: "merkle_claims_allocation",
					type: "u64"
				},
				{
					name: "bump",
					type: "u8"
				}
			]
		}
	},
	{
		name: "ProjectCreatedEvent",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "project_name",
					type: "string"
				},
				{
					name: "authority",
					type: "pubkey"
				},
				{
					name: "old_token_mint",
					type: "pubkey"
				},
				{
					name: "new_token_mint",
					type: "pubkey"
				},
				{
					name: "old_token_vault",
					type: "pubkey"
				},
				{
					name: "new_token_vault",
					type: "pubkey"
				},
				{
					name: "quote_token_vault",
					type: "pubkey"
				},
				{
					name: "is_protected",
					type: "bool"
				},
				{
					name: "target_percentage",
					type: "u16"
				},
				{
					name: "migration_deadline",
					type: "i64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "ProjectCreationFeeCollected",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "amount",
					type: "u64"
				},
				{
					name: "payer",
					type: "pubkey"
				},
				{
					name: "treasury",
					type: "pubkey"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "ProjectEmergencyWithdrawToggled",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "enabled",
					type: "bool"
				},
				{
					name: "platform_admin",
					type: "pubkey"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "ProjectFeeUpdated",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "old_fee",
					type: "u16"
				},
				{
					name: "new_fee",
					type: "u16"
				},
				{
					name: "admin",
					type: "pubkey"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "ProjectFinalized",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "total_migrated",
					type: "u64"
				},
				{
					name: "finalized_at",
					type: "i64"
				}
			]
		}
	},
	{
		name: "ProjectInitialized",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "project_name",
					type: "string"
				},
				{
					name: "admin",
					type: "pubkey"
				},
				{
					name: "old_token_mint",
					type: "pubkey"
				},
				{
					name: "new_token_mint",
					type: "pubkey"
				},
				{
					name: "start_ts",
					type: "i64"
				},
				{
					name: "end_ts",
					type: "i64"
				},
				{
					name: "fee_basis_points",
					type: "u16"
				}
			]
		}
	},
	{
		name: "ProjectInitializedEvent",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "old_token_vault",
					type: "pubkey"
				},
				{
					name: "quote_token_vault",
					type: "pubkey"
				},
				{
					name: "mft_mint",
					type: "pubkey"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "ProjectPaused",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "paused",
					type: "bool"
				},
				{
					name: "admin",
					type: "pubkey"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "ProtectionParams",
		type: {
			kind: "struct",
			fields: [
				{
					name: "target_migration_percentage",
					type: "u16"
				},
				{
					name: "total_old_token_supply",
					type: "u64"
				},
				{
					name: "late_claim_haircut_bps",
					type: "u16"
				}
			]
		}
	},
	{
		name: "RefundClaimed",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "user",
					type: "pubkey"
				},
				{
					name: "amount_refunded",
					type: "u64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "SolRefundClaimed",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "user",
					type: "pubkey"
				},
				{
					name: "sol_refunded",
					type: "u64"
				},
				{
					name: "user_tokens_migrated",
					type: "u64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "SourcePoolType",
		type: {
			kind: "enum",
			variants: [
				{
					name: "RaydiumCPMM"
				},
				{
					name: "MeteoraDynamicAMM"
				},
				{
					name: "PumpSwap"
				},
				{
					name: "MeteoraDynamicAMMV2"
				},
				{
					name: "RaydiumV4"
				}
			]
		}
	},
	{
		name: "SwapWarning",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "warning_type",
					type: "string"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "TokenMarkedAsCreated",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "admin",
					type: "pubkey"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "TokenMigrated",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "user",
					type: "pubkey"
				},
				{
					name: "old_tokens_in",
					type: "u64"
				},
				{
					name: "new_tokens_out",
					type: "u64"
				},
				{
					name: "fee_paid",
					type: "u64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "TokenSwappedToQuote",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "old_tokens_swapped",
					type: "u64"
				},
				{
					name: "quote_received",
					type: "u64"
				},
				{
					name: "amm_pool_id",
					type: "pubkey"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "TransferredToClaims",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "amount",
					type: "u64"
				},
				{
					name: "claims_vault",
					type: "pubkey"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "UnclaimedAssetsRecovered",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "admin",
					type: "pubkey"
				},
				{
					name: "old_tokens_remaining",
					type: "u64"
				},
				{
					name: "new_tokens_recovered",
					type: "u64"
				},
				{
					name: "quote_tokens_recovered",
					type: "u64"
				},
				{
					name: "recovered_at",
					type: "i64"
				}
			]
		}
	},
	{
		name: "UnclaimedFailureRecovered",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "admin",
					type: "pubkey"
				},
				{
					name: "amount_recovered",
					type: "u64"
				},
				{
					name: "recovery_deadline_ts",
					type: "i64"
				},
				{
					name: "recovered_at",
					type: "i64"
				}
			]
		}
	},
	{
		name: "UserMerkleClaim",
		type: {
			kind: "struct",
			fields: [
				{
					name: "user",
					type: "pubkey"
				},
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "amount",
					type: "u64"
				},
				{
					name: "claimed_at",
					type: "i64"
				},
				{
					name: "bump",
					type: "u8"
				}
			]
		}
	},
	{
		name: "UserMigration",
		type: {
			kind: "struct",
			fields: [
				{
					name: "project_id",
					type: "string"
				},
				{
					name: "user",
					type: "pubkey"
				},
				{
					name: "amount_migrated",
					type: "u64"
				},
				{
					name: "migrated_at_ts",
					type: "i64"
				},
				{
					name: "has_claimed_failed_sol",
					type: "bool"
				},
				{
					name: "failed_sol_claimed",
					type: "u64"
				},
				{
					name: "has_claimed_refund",
					type: "bool"
				},
				{
					name: "refund_claimed_at",
					type: "i64"
				},
				{
					name: "bump",
					type: "u8"
				}
			]
		}
	}
];
var mainnetIdlJson = {
	address: address,
	metadata: metadata,
	instructions: instructions,
	accounts: accounts,
	events: events,
	errors: errors,
	types: types
};

/**
 * Program resolution and IDL handling for the migrate.fun migration program
 *
 * This module handles:
 * - Network-specific IDL loading (devnet vs mainnet)
 * - Program ID resolution
 * - Anchor Program instance creation
 * - Environment variable configuration
 *
 * @module program
 */

/**
 * Type representing the base IDL structure
 */
type BaseIdl = typeof devnetIdlJson | typeof mainnetIdlJson;
/**
 * IDL type with string address (for serialization compatibility)
 */
type WithStringAddress<T> = Omit<T, 'address'> & {
    address: string;
};
type HustleMigrationIdl = WithStringAddress<BaseIdl> & {
    __migrationIdl: true;
};
/**
 * Resolve the network from environment variables
 *
 * Checks in order:
 * 1. SOLANA_NETWORK env var
 * 2. NEXT_PUBLIC_SOLANA_NETWORK env var
 * 3. Defaults to 'devnet'
 *
 * @returns {Network} The resolved network ('devnet' or 'mainnet-beta')
 * @throws {Error} If an unsupported network is specified
 */
declare function resolveNetwork(explicit?: Network): Network;
/**
 * Get the currently active network
 *
 * @returns {Network} The active network
 */
declare function getActiveNetwork(): Network;
/**
 * Set the active network (forces IDL reload)
 *
 * @param {Network} network - Network to activate
 */
declare function setActiveNetwork(network: Network): void;
/**
 * Get the migration program ID for a given network
 *
 * This is the primary entry point for getting the program ID.
 * By default, uses the program ID from the bundled IDL.
 * Can be overridden via MIGRATION_PROGRAM_OVERRIDE env var.
 *
 * @param {Network} [network] - Optional network override
 * @returns {PublicKey} The migration program ID
 *
 * @example
 * ```typescript
 * import { PROGRAM_ID } from '@migratefun/sdk';
 *
 * console.log(PROGRAM_ID.toBase58());
 * // => "migkduYrPRH1tt7jdpdeu6BjRrJw5DSoLPcD9W2pp68"
 * ```
 */
declare function getProgramId(network?: Network): PublicKey;
/**
 * Default program ID (loaded for current network)
 */
declare const PROGRAM_ID: PublicKey;
/**
 * Get the Anchor IDL for the migration program
 *
 * @param {Network} [network] - Optional network override
 * @returns {HustleMigrationIdl} The typed IDL
 *
 * @example
 * ```typescript
 * import { getIdl } from '@migratefun/sdk';
 *
 * const idl = getIdl('mainnet-beta');
 * console.log(idl.version); // => "0.1.0"
 * ```
 */
declare function getIdl(network?: Network): HustleMigrationIdl;
/**
 * Configuration options for creating a Program instance
 */
interface GetProgramOptions {
    /**
     * Network to use (defaults to active network)
     */
    network?: Network;
    /**
     * IDL source preference
     * - 'bundle': Use bundled IDL (default, fastest)
     * - 'onchain': Fetch IDL from on-chain (requires RPC call)
     */
    idlSource?: IdlSource;
}
/**
 * Create an Anchor Program instance for the migration program
 *
 * This is the main entry point for creating a typed Program instance
 * that can be used to call migration instructions.
 *
 * @param {Connection | AnchorProvider} connectionOrProvider - Solana connection or Anchor provider
 * @param {GetProgramOptions} [options] - Configuration options
 * @returns {Promise<Program>} Typed Anchor Program instance
 *
 * @example
 * ```typescript
 * import { Connection } from '@solana/web3.js';
 * import { getProgram } from '@migratefun/sdk';
 *
 * const connection = new Connection('https://api.devnet.solana.com');
 * const program = await getProgram(connection, { network: 'devnet' });
 *
 * // Now you can call program methods
 * const projectConfig = await program.account.projectConfig.fetch(projectConfigPda);
 * ```
 */
declare function getProgram(connectionOrProvider: Connection | AnchorProvider, options?: GetProgramOptions): Promise<Program>;
/**
 * Reset the IDL cache (useful for testing)
 * @internal
 */
declare function _resetCache(): void;

/**
 * Program Derived Address (PDA) utilities for the migrate.fun migration program
 *
 * This module provides functions to derive all PDAs used by the migration program.
 * PDAs are deterministic addresses derived from seeds and the program ID.
 *
 * @module pdas
 */

/**
 * Options for PDA derivation
 */
interface PdaOptions {
    /**
     * Network to use for program ID resolution
     */
    network?: Network;
}
/**
 * Get the project config PDA for a given project
 *
 * The project config PDA stores all project configuration including:
 * - Token mints (old/new)
 * - Migration timing (start/end timestamps)
 * - Exchange rates and decimals
 * - Pause status and phase
 *
 * @param {string} projectId - Unique project identifier (max 16 characters)
 * @param {PdaOptions} [options] - PDA derivation options
 * @returns {[PublicKey, number]} Tuple of [PDA address, bump seed]
 *
 * @example
 * ```typescript
 * import { getProjectConfigPda } from '@migratefun/sdk';
 *
 * const [projectConfigPda, bump] = getProjectConfigPda('my-project');
 * console.log(projectConfigPda.toBase58());
 * ```
 */
declare function getProjectConfigPda(projectId: string, options?: PdaOptions): [PublicKey, number];
/**
 * Get the old token vault PDA for a project
 *
 * The old token vault holds tokens that users migrate from.
 * Users send their old tokens to this vault during migration.
 *
 * @param {string} projectId - Unique project identifier
 * @param {PdaOptions} [options] - PDA derivation options
 * @returns {[PublicKey, number]} Tuple of [PDA address, bump seed]
 *
 * @example
 * ```typescript
 * import { getOldTokenVaultPda } from '@migratefun/sdk';
 *
 * const [vaultPda] = getOldTokenVaultPda('my-project');
 * ```
 */
declare function getOldTokenVaultPda(projectId: string, options?: PdaOptions): [PublicKey, number];
/**
 * Get the new token vault PDA for a project
 *
 * The new token vault holds tokens that are distributed to users
 * who claim with MFT (Migration Finalization Tokens).
 *
 * @param {string} projectId - Unique project identifier
 * @param {PdaOptions} [options] - PDA derivation options
 * @returns {[PublicKey, number]} Tuple of [PDA address, bump seed]
 *
 * @example
 * ```typescript
 * import { getNewTokenVaultPda } from '@migratefun/sdk';
 *
 * const [vaultPda] = getNewTokenVaultPda('my-project');
 * ```
 */
declare function getNewTokenVaultPda(projectId: string, options?: PdaOptions): [PublicKey, number];
/**
 * Get the WSOL vault PDA for a project
 *
 * The WSOL vault holds wrapped SOL collected as migration fees.
 *
 * @param {string} projectId - Unique project identifier
 * @param {PdaOptions} [options] - PDA derivation options
 * @returns {[PublicKey, number]} Tuple of [PDA address, bump seed]
 *
 * @example
 * ```typescript
 * import { getWsolVaultPda } from '@migratefun/sdk';
 *
 * const [wsolVault] = getWsolVaultPda('my-project');
 * ```
 */
declare function getWsolVaultPda(projectId: string, options?: PdaOptions): [PublicKey, number];
/**
 * Get the quote token vault PDA for a project
 *
 * Used for projects that collect fees in a specific token (e.g., USDC).
 *
 * @param {string} projectId - Unique project identifier
 * @param {PdaOptions} [options] - PDA derivation options
 * @returns {[PublicKey, number]} Tuple of [PDA address, bump seed]
 *
 * @example
 * ```typescript
 * import { getQuoteTokenVaultPda } from '@migratefun/sdk';
 *
 * const [quoteVault] = getQuoteTokenVaultPda('my-project');
 * ```
 */
declare function getQuoteTokenVaultPda(projectId: string, options?: PdaOptions): [PublicKey, number];
/**
 * Get the MFT (Migration Finalization Token) mint PDA for a project
 *
 * MFT is a receipt token minted to users during migration.
 * Users can later burn MFT to claim new tokens at 1:1 ratio.
 *
 * @param {string} projectId - Unique project identifier
 * @param {PdaOptions} [options] - PDA derivation options
 * @returns {[PublicKey, number]} Tuple of [PDA address, bump seed]
 *
 * @example
 * ```typescript
 * import { getMftMintPda } from '@migratefun/sdk';
 *
 * const [mftMint] = getMftMintPda('my-project');
 * ```
 */
declare function getMftMintPda(projectId: string, options?: PdaOptions): [PublicKey, number];
/**
 * Get the LP vault PDA for a project
 *
 * Holds liquidity pool tokens for projects that create DEX pools.
 *
 * @param {string} projectId - Unique project identifier
 * @param {PdaOptions} [options] - PDA derivation options
 * @returns {[PublicKey, number]} Tuple of [PDA address, bump seed]
 *
 * @example
 * ```typescript
 * import { getLpVaultPda } from '@migratefun/sdk';
 *
 * const [lpVault] = getLpVaultPda('my-project');
 * ```
 */
declare function getLpVaultPda(projectId: string, options?: PdaOptions): [PublicKey, number];
/**
 * Get the user migration PDA for a user and project
 *
 * Stores per-user migration data including:
 * - Amount migrated
 * - MFT received
 * - Refund claim status
 *
 * @param {PublicKey} user - User wallet public key
 * @param {string} projectId - Unique project identifier
 * @param {PdaOptions} [options] - PDA derivation options
 * @returns {[PublicKey, number]} Tuple of [PDA address, bump seed]
 *
 * @example
 * ```typescript
 * import { getUserMigrationPda } from '@migratefun/sdk';
 * import { PublicKey } from '@solana/web3.js';
 *
 * const userPubkey = new PublicKey('...');
 * const [userMigration] = getUserMigrationPda(userPubkey, 'my-project');
 * ```
 */
declare function getUserMigrationPda(user: PublicKey, projectId: string, options?: PdaOptions): [PublicKey, number];
/**
 * Get the project registry PDA
 *
 * The registry maintains a list of all project IDs in the system.
 *
 * @param {PdaOptions} [options] - PDA derivation options
 * @returns {[PublicKey, number]} Tuple of [PDA address, bump seed]
 *
 * @example
 * ```typescript
 * import { getRegistryPda } from '@migratefun/sdk';
 *
 * const [registry] = getRegistryPda();
 * ```
 */
declare function getRegistryPda(options?: PdaOptions): [PublicKey, number];
/**
 * Get the platform config PDA
 *
 * Stores global platform configuration including admin settings and fees.
 *
 * @param {PdaOptions} [options] - PDA derivation options
 * @returns {[PublicKey, number]} Tuple of [PDA address, bump seed]
 *
 * @example
 * ```typescript
 * import { getPlatformConfigPda } from '@migratefun/sdk';
 *
 * const [platformConfig] = getPlatformConfigPda();
 * ```
 */
declare function getPlatformConfigPda(options?: PdaOptions): [PublicKey, number];
/**
 * Get the platform fee vault PDA
 *
 * Holds platform fees collected in a specific quote token.
 *
 * @param {PublicKey} platformConfig - Platform config PDA
 * @param {PublicKey} quoteTokenMint - Quote token mint address
 * @param {PdaOptions} [options] - PDA derivation options
 * @returns {[PublicKey, number]} Tuple of [PDA address, bump seed]
 *
 * @example
 * ```typescript
 * import { getPlatformFeeVaultPda, getPlatformConfigPda } from '@migratefun/sdk';
 * import { PublicKey } from '@solana/web3.js';
 *
 * const [platformConfig] = getPlatformConfigPda();
 * const usdcMint = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
 * const [feeVault] = getPlatformFeeVaultPda(platformConfig, usdcMint);
 * ```
 */
declare function getPlatformFeeVaultPda(platformConfig: PublicKey, quoteTokenMint: PublicKey, options?: PdaOptions): [PublicKey, number];
/**
 * Get the associated token address (ATA) for a user and mint
 *
 * Helper function to derive ATAs used in migration transactions.
 * Supports both TOKEN_PROGRAM_ID and TOKEN_2022_PROGRAM_ID.
 *
 * @param {PublicKey} user - User wallet public key
 * @param {PublicKey} mint - Token mint address
 * @param {PublicKey} [tokenProgram=TOKEN_PROGRAM_ID] - Token program (TOKEN_PROGRAM_ID or TOKEN_2022_PROGRAM_ID)
 * @returns {PublicKey} Associated token address
 *
 * @example
 * ```typescript
 * import { getUserAta } from '@migratefun/sdk';
 * import { PublicKey } from '@solana/web3.js';
 * import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
 *
 * const userPubkey = new PublicKey('...');
 * const tokenMint = new PublicKey('...');
 * const ata = getUserAta(userPubkey, tokenMint, TOKEN_PROGRAM_ID);
 * ```
 */
declare function getUserAta(user: PublicKey, mint: PublicKey, tokenProgram?: PublicKey): PublicKey;
/**
 * Batch derive multiple PDAs for a project
 *
 * Convenience function to derive all common PDAs for a project at once.
 * More efficient than calling individual functions.
 *
 * @param {string} projectId - Unique project identifier
 * @param {PdaOptions} [options] - PDA derivation options
 * @returns Object with all derived PDAs
 *
 * @example
 * ```typescript
 * import { getProjectPdas } from '@migratefun/sdk';
 *
 * const pdas = getProjectPdas('my-project');
 * console.log(pdas.projectConfig.toBase58());
 * console.log(pdas.oldTokenVault.toBase58());
 * console.log(pdas.newTokenVault.toBase58());
 * console.log(pdas.mftMint.toBase58());
 * ```
 */
declare function getProjectPdas(projectId: string, options?: PdaOptions): {
    projectConfig: PublicKey;
    oldTokenVault: PublicKey;
    newTokenVault: PublicKey;
    mftMint: PublicKey;
    wsolVault: PublicKey;
    quoteTokenVault: PublicKey;
    lpVault: PublicKey;
};

/**
 * Balance fetching and project discovery for the migrate.fun SDK
 *
 * This module provides functions to:
 * - Load project configurations from the blockchain
 * - Fetch user token balances (SOL, old token, new token, MFT)
 * - Watch balances for real-time updates
 *
 * @module balances
 */

/**
 * Options for loading a project
 */
interface LoadProjectOptions {
    /**
     * Network to use (defaults to current active network)
     */
    network?: Network;
    /**
     * Skip cache and fetch fresh data
     */
    skipCache?: boolean;
}
/**
 * Options for fetching balances
 */
interface GetBalancesOptions {
    /**
     * Network to use (defaults to current active network)
     */
    network?: Network;
    /**
     * Skip cache and fetch fresh data
     */
    skipCache?: boolean;
}
/**
 * Options for watching balances
 */
interface WatchBalancesOptions {
    /**
     * Poll interval in milliseconds (default: 150ms)
     */
    intervalMs?: number;
    /**
     * Network to use (defaults to current active network)
     */
    network?: Network;
}
/**
 * Unsubscribe function returned by watchBalances
 */
type UnsubscribeFn = () => void;
/**
 * Load complete project configuration and metadata from the blockchain
 *
 * Fetches all project data including token mints, decimals, exchange rates,
 * phase information, and derives all necessary PDAs.
 *
 * @param {string} projectId - Unique project identifier
 * @param {Connection} connection - Solana RPC connection
 * @param {LoadProjectOptions} [options] - Loading options
 * @returns {Promise<LoadedProject>} Complete project metadata with PDAs
 * @throws {SdkError} If project not found or fetch fails
 *
 * @example
 * ```typescript
 * import { Connection } from '@solana/web3.js';
 * import { loadProject } from '@migratefun/sdk';
 *
 * const connection = new Connection('https://api.devnet.solana.com');
 * const project = await loadProject('my-project', connection);
 *
 * console.log(`Exchange rate: ${project.exchangeRate}`);
 * console.log(`Old token mint: ${project.oldTokenMint.toBase58()}`);
 * console.log(`Phase: ${project.phase}`);
 * ```
 */
declare function loadProject(projectId: string, connection: Connection, options?: LoadProjectOptions): Promise<LoadedProject>;
/**
 * Get all token balances for a user in a specific project
 *
 * Fetches SOL balance and token balances (old token, new token, MFT)
 * in a single batch of RPC requests with rate limiting.
 *
 * @param {string} projectId - Unique project identifier
 * @param {PublicKey} user - User wallet public key
 * @param {Connection} connection - Solana RPC connection
 * @param {LoadedProject} [project] - Pre-loaded project (skips project fetch)
 * @param {GetBalancesOptions} [options] - Balance fetching options
 * @returns {Promise<BalanceSnapshot>} All user balances as bigint
 * @throws {SdkError} If balance fetch fails
 *
 * @example
 * ```typescript
 * import { Connection, PublicKey } from '@solana/web3.js';
 * import { getBalances } from '@migratefun/sdk';
 *
 * const connection = new Connection('https://api.devnet.solana.com');
 * const userPubkey = new PublicKey('...');
 *
 * const balances = await getBalances('my-project', userPubkey, connection);
 *
 * console.log(`SOL: ${Number(balances.sol) / 1e9}`);
 * console.log(`Old token: ${balances.oldToken}`);
 * console.log(`New token: ${balances.newToken}`);
 * console.log(`MFT: ${balances.mft}`);
 * ```
 */
declare function getBalances(projectId: string, user: PublicKey, connection: Connection, project?: LoadedProject, options?: GetBalancesOptions): Promise<BalanceSnapshot>;
/**
 * Watch user balances for real-time updates
 *
 * Polls balances at a configurable interval and calls the onChange callback
 * whenever balances change. Automatically throttles RPC requests.
 *
 * @param {string} projectId - Unique project identifier
 * @param {PublicKey} user - User wallet public key
 * @param {Connection} connection - Solana RPC connection
 * @param {(balances: BalanceSnapshot) => void} onChange - Callback for balance updates
 * @param {WatchBalancesOptions} [options] - Watch options
 * @returns {UnsubscribeFn} Function to stop watching balances
 *
 * @example
 * ```typescript
 * import { Connection, PublicKey } from '@solana/web3.js';
 * import { watchBalances } from '@migratefun/sdk';
 *
 * const connection = new Connection('https://api.devnet.solana.com');
 * const userPubkey = new PublicKey('...');
 *
 * const unsubscribe = watchBalances(
 *   'my-project',
 *   userPubkey,
 *   connection,
 *   (balances) => {
 *     console.log('Balances updated:', balances);
 *   },
 *   { intervalMs: 1000 } // Poll every second
 * );
 *
 * // Stop watching after 10 seconds
 * setTimeout(() => unsubscribe(), 10000);
 * ```
 */
declare function watchBalances(projectId: string, user: PublicKey, connection: Connection, onChange: (balances: BalanceSnapshot) => void, options?: WatchBalancesOptions): UnsubscribeFn;
/**
 * Check if a project is currently paused
 *
 * @param {LoadedProject} project - Loaded project
 * @returns {boolean} True if project is paused
 *
 * @example
 * ```typescript
 * import { loadProject, isProjectPaused } from '@migratefun/sdk';
 *
 * const project = await loadProject('my-project', connection);
 * if (isProjectPaused(project)) {
 *   console.log('Project is paused - migrations are disabled');
 * }
 * ```
 */
declare function isProjectPaused(project: LoadedProject): boolean;
/**
 * Check if a project is in the active migration phase
 *
 * @param {LoadedProject} project - Loaded project
 * @returns {boolean} True if project is in active migration phase
 *
 * @example
 * ```typescript
 * import { loadProject, isProjectActive } from '@migratefun/sdk';
 *
 * const project = await loadProject('my-project', connection);
 * if (isProjectActive(project)) {
 *   console.log('Project is active - users can migrate');
 * }
 * ```
 */
declare function isProjectActive(project: LoadedProject): boolean;
/**
 * Format a token amount from raw bigint to human-readable string
 *
 * Returns a string to preserve precision for large amounts (>Number.MAX_SAFE_INTEGER).
 * For amounts larger than 9 million tokens with 9 decimals, converting to Number
 * would lose precision.
 *
 * @param {bigint} amount - Raw token amount
 * @param {number} decimals - Token decimals
 * @returns {string} Human-readable amount as string (preserves full precision)
 *
 * @example
 * ```typescript
 * import { getBalances, formatTokenAmount } from '@migratefun/sdk';
 *
 * const balances = await getBalances('my-project', user, connection);
 * const oldTokenAmount = formatTokenAmount(balances.oldToken, 9);
 * console.log(`Old token balance: ${oldTokenAmount}`); // "100.500000000"
 * ```
 */
declare function formatTokenAmount(amount: bigint, decimals: number): string;
/**
 * Convert a human-readable token amount to raw bigint
 *
 * Validates input and handles edge cases including scientific notation,
 * NaN, infinity, and negative numbers.
 *
 * @param {number} amount - Human-readable amount
 * @param {number} decimals - Token decimals
 * @returns {bigint} Raw token amount
 * @throws {SdkError} If amount is invalid (NaN, infinite, negative, or out of range)
 *
 * @example
 * ```typescript
 * import { parseTokenAmount } from '@migratefun/sdk';
 *
 * const amount = parseTokenAmount(100.5, 9);
 * console.log(amount); // => 100500000000n
 * ```
 */
declare function parseTokenAmount(amount: number, decimals: number): bigint;

/**
 * Transaction builders for migration operations
 *
 * This module provides functions to build Solana transactions for:
 * - Token migration (migrate old tokens to new tokens)
 * - MFT claiming (redeem MFT for new tokens)
 * - Transaction simulation and validation
 *
 * @module builders
 */

/**
 * Options for building a migration transaction
 */
interface BuildMigrateTxOptions {
    /**
     * Skip pre-flight simulation (default: false)
     */
    skipPreflight?: boolean;
    /**
     * Compute unit limit for the transaction (optional)
     */
    computeUnitLimit?: number;
    /**
     * Compute unit price for priority fees (optional, in micro-lamports)
     */
    computeUnitPrice?: number;
}
/**
 * Result of building a migration transaction
 */
interface BuildMigrateTxResult {
    /**
     * The built transaction, ready to sign and send
     */
    transaction: Transaction;
    /**
     * Amount being migrated (in token base units)
     */
    amount: bigint;
    /**
     * Expected MFT to be received (in token base units)
     */
    expectedMft: bigint;
    /**
     * Required accounts for the transaction
     * Note: PDAs (oldTokenVault, userMigration) are automatically derived by Anchor 0.31.0
     */
    accounts: {
        user: PublicKey;
        projectConfig: PublicKey;
        userOldTokenAta: PublicKey;
        userMftAta: PublicKey;
        oldTokenMint: PublicKey;
        mftMint: PublicKey;
    };
}
/**
 * Build a token migration transaction
 *
 * Creates a transaction that migrates old tokens to receive MFT (Migration Finalization Tokens).
 * The MFT can later be redeemed 1:1 for new tokens.
 *
 * @param {Connection} connection - Solana RPC connection
 * @param {PublicKey} user - User wallet public key
 * @param {string} projectId - Project identifier
 * @param {bigint} amount - Amount to migrate in token base units (not decimals)
 * @param {LoadedProject} project - Pre-loaded project configuration
 * @param {BuildMigrateTxOptions} [options] - Transaction options
 * @returns {Promise<BuildMigrateTxResult>} Transaction and metadata
 * @throws {SdkError} If project is paused, migration window closed, or invalid amount
 *
 * @example
 * ```typescript
 * import { Connection, PublicKey } from '@solana/web3.js';
 * import { loadProject, buildMigrateTx, parseTokenAmount } from '@migratefun/sdk';
 *
 * const connection = new Connection('https://api.devnet.solana.com');
 * const user = new PublicKey('...');
 *
 * // Load project first
 * const project = await loadProject('my-project', connection);
 *
 * // Parse user input to token base units
 * const amount = parseTokenAmount(100.5, project.oldTokenDecimals);
 *
 * // Build transaction
 * const { transaction, expectedMft } = await buildMigrateTx(
 *   connection,
 *   user,
 *   'my-project',
 *   amount,
 *   project
 * );
 *
 * // Sign and send
 * transaction.feePayer = user;
 * const signed = await wallet.signTransaction(transaction);
 * const signature = await connection.sendRawTransaction(signed.serialize());
 * ```
 */
declare function buildMigrateTx(connection: Connection, user: PublicKey, projectId: string, amount: bigint, project: LoadedProject, options?: BuildMigrateTxOptions): Promise<BuildMigrateTxResult>;
/**
 * Options for building an MFT claim transaction
 */
interface BuildClaimMftTxOptions extends BuildMigrateTxOptions {
}
/**
 * Result of building an MFT claim transaction
 */
interface BuildClaimMftTxResult {
    /**
     * The built transaction, ready to sign and send
     */
    transaction: Transaction;
    /**
     * Amount of MFT being claimed (in base units)
     */
    mftAmount: bigint;
    /**
     * Expected new tokens to receive (in base units)
     */
    expectedNewTokens: bigint;
    /**
     * Required accounts for the transaction
     * Note: PDAs (newTokenVault) are automatically derived by Anchor 0.31.0
     */
    accounts: {
        user: PublicKey;
        projectConfig: PublicKey;
        userMftAta: PublicKey;
        userNewTokenAta: PublicKey;
        newTokenMint: PublicKey;
        mftMint: PublicKey;
    };
}
/**
 * Build an MFT claim transaction
 *
 * Creates a transaction that burns MFT tokens to receive new tokens at 1:1 ratio.
 *
 * @param {Connection} connection - Solana RPC connection
 * @param {PublicKey} user - User wallet public key
 * @param {string} projectId - Project identifier
 * @param {bigint} mftAmount - Amount of MFT to claim (in base units)
 * @param {LoadedProject} project - Pre-loaded project configuration
 * @param {BuildClaimMftTxOptions} [options] - Transaction options
 * @returns {Promise<BuildClaimMftTxResult>} Transaction and metadata
 * @throws {SdkError} If claims not enabled or invalid amount
 *
 * @example
 * ```typescript
 * import { Connection, PublicKey } from '@solana/web3.js';
 * import { loadProject, buildClaimMftTx, parseTokenAmount } from '@migratefun/sdk';
 *
 * const connection = new Connection('https://api.devnet.solana.com');
 * const user = new PublicKey('...');
 *
 * // Load project first
 * const project = await loadProject('my-project', connection);
 *
 * // Parse MFT amount (MFT always has 9 decimals)
 * const mftAmount = parseTokenAmount(100, 9);
 *
 * // Build claim transaction
 * const { transaction, expectedNewTokens } = await buildClaimMftTx(
 *   connection,
 *   user,
 *   'my-project',
 *   mftAmount,
 *   project
 * );
 *
 * // Sign and send
 * transaction.feePayer = user;
 * const signed = await wallet.signTransaction(transaction);
 * const signature = await connection.sendRawTransaction(signed.serialize());
 * ```
 */
declare function buildClaimMftTx(connection: Connection, user: PublicKey, projectId: string, mftAmount: bigint, project: LoadedProject, _options?: BuildClaimMftTxOptions): Promise<BuildClaimMftTxResult>;
/**
 * Simulate a transaction to check if it would succeed
 *
 * @param {Connection} connection - Solana RPC connection
 * @param {Transaction} transaction - Transaction to simulate
 * @returns {Promise<boolean>} True if simulation succeeds
 * @throws {SdkError} If simulation fails with error details
 *
 * @example
 * ```typescript
 * import { buildMigrateTx, simulateTransaction } from '@migratefun/sdk';
 *
 * const { transaction } = await buildMigrateTx(...);
 *
 * // Simulate before sending
 * const willSucceed = await simulateTransaction(connection, transaction);
 * if (willSucceed) {
 *   // Proceed with signing and sending
 * }
 * ```
 */
declare function simulateTransaction(connection: Connection, transaction: Transaction): Promise<boolean>;
/**
 * Send and confirm a transaction with retry logic
 *
 * @param {Connection} connection - Solana RPC connection
 * @param {Transaction} transaction - Signed transaction to send
 * @param {Object} options - Send options
 * @returns {Promise<string>} Transaction signature
 * @throws {SdkError} If transaction fails
 *
 * @example
 * ```typescript
 * import { buildMigrateTx, sendAndConfirmTransaction } from '@migratefun/sdk';
 *
 * const { transaction } = await buildMigrateTx(...);
 * transaction.feePayer = user;
 * const signed = await wallet.signTransaction(transaction);
 *
 * const signature = await sendAndConfirmTransaction(
 *   connection,
 *   signed,
 *   { skipPreflight: false }
 * );
 *
 * console.log('Transaction confirmed:', signature);
 * ```
 */
declare function sendAndConfirmTransaction(connection: Connection, transaction: Transaction, options?: {
    skipPreflight?: boolean;
}): Promise<string>;

/**
 * Error mapping and normalization for the migrate.fun SDK
 *
 * This module provides:
 * - Mapping of Anchor program errors to user-friendly messages
 * - Normalization of common blockchain errors
 * - Error parsing and categorization
 * - User-friendly error messages with recovery guidance
 *
 * @module errors
 */

/**
 * Parse a raw error into a structured SdkError
 *
 * This function normalizes errors from various sources (Anchor, RPC, network)
 * into a consistent SdkError format with user-friendly messages.
 *
 * @param {unknown} error - The raw error to parse
 * @returns {SdkError} Structured SDK error with code and message
 *
 * @example
 * ```typescript
 * import { parseError } from '@migratefun/sdk';
 *
 * try {
 *   await program.methods.migrate().rpc();
 * } catch (err) {
 *   const sdkError = parseError(err);
 *   console.log(sdkError.code); // => 'PROJECT_PAUSED'
 *   console.log(sdkError.message); // User-friendly message
 * }
 * ```
 */
declare function parseError(error: unknown): SdkError;
/**
 * Get user-friendly error message with recovery actions
 *
 * Provides detailed guidance for users on how to resolve errors.
 *
 * @param {SdkError | unknown} error - The error to format
 * @returns Formatted error information
 *
 * @example
 * ```typescript
 * import { getErrorDetails, parseError } from '@migratefun/sdk';
 *
 * try {
 *   await executeMigration();
 * } catch (err) {
 *   const sdkError = parseError(err);
 *   const details = getErrorDetails(sdkError);
 *
 *   console.log(details.title); // => "Migration Error"
 *   console.log(details.message); // User-friendly message
 *   console.log(details.actions); // Array of recovery steps
 * }
 * ```
 */
declare function getErrorDetails(error: SdkError | unknown): {
    title: string;
    message: string;
    actions: string[];
    code: string;
    canRetry: boolean;
};
/**
 * Check if an error is retryable
 *
 * Some errors (like rate limits or network issues) can be resolved by retrying.
 * Others (like validation errors) require user action before retrying.
 *
 * @param {SdkError | unknown} error - The error to check
 * @returns {boolean} True if the operation can be retried
 *
 * @example
 * ```typescript
 * import { parseError, isRetryableError } from '@migratefun/sdk';
 *
 * try {
 *   await migrate();
 * } catch (err) {
 *   const sdkError = parseError(err);
 *
 *   if (isRetryableError(sdkError)) {
 *     // Show retry button
 *     console.log('You can try again');
 *   } else {
 *     // Show error message without retry
 *     console.log('Please fix the issue first');
 *   }
 * }
 * ```
 */
declare function isRetryableError(error: SdkError | unknown): boolean;
/**
 * Format error for logging (includes stack trace)
 *
 * @param {SdkError | unknown} error - The error to format
 * @returns {string} Formatted error string for logging
 *
 * @example
 * ```typescript
 * import { parseError, formatErrorForLog } from '@migratefun/sdk';
 *
 * try {
 *   await migrate();
 * } catch (err) {
 *   const formatted = formatErrorForLog(err);
 *   console.error(formatted);
 *   // Log to your error tracking service
 * }
 * ```
 */
declare function formatErrorForLog(error: SdkError | unknown): string;

/**
 * Caching and RPC throttling utilities for the migrate.fun SDK
 *
 * This module provides:
 * - In-memory caching with TTL support
 * - RPC request throttling to avoid rate limits
 * - Memoization helpers for expensive operations
 *
 * @module utils/cache
 */
/**
 * TTL constants for different data types (in milliseconds)
 */
declare const CACHE_TTL: {
    /** Balance queries - 30 seconds */
    readonly BALANCES: 30000;
    /** Token metadata - 5 minutes */
    readonly METADATA: 300000;
    /** Project configurations - 1 hour */
    readonly PROJECT_CONFIG: 3600000;
    /** Token supplies - 30 seconds */
    readonly SUPPLY: 30000;
    /** Account info - 10 seconds */
    readonly ACCOUNT_INFO: 10000;
};
/**
 * Simple in-memory cache with TTL support
 *
 * @example
 * ```typescript
 * const cache = new Cache<string>();
 * cache.set('key', 'value', 30000); // Cache for 30 seconds
 * const value = cache.get('key');
 * ```
 */
declare class Cache<T = any> {
    private cache;
    private defaultTTL;
    /**
     * Create a new cache instance
     *
     * @param {number} [defaultTTL=30000] - Default TTL in milliseconds
     */
    constructor(defaultTTL?: number);
    /**
     * Store a value in the cache
     *
     * @param {string} key - Cache key
     * @param {T} data - Data to cache
     * @param {number} [ttl] - Time to live in milliseconds (defaults to instance default)
     */
    set(key: string, data: T, ttl?: number): void;
    /**
     * Retrieve a value from the cache
     *
     * @param {string} key - Cache key
     * @returns {T | null} Cached value or null if not found/expired
     */
    get(key: string): T | null;
    /**
     * Check if a key exists and is not expired
     *
     * @param {string} key - Cache key
     * @returns {boolean} True if key exists and is valid
     */
    has(key: string): boolean;
    /**
     * Remove a specific key from the cache
     *
     * @param {string} key - Cache key to delete
     */
    delete(key: string): void;
    /**
     * Clear all cached values
     */
    clear(): void;
    /**
     * Get the number of cached entries
     *
     * @returns {number} Number of cached entries
     */
    size(): number;
}
/**
 * Global SDK cache instance
 *
 * Used internally by the SDK for caching RPC responses.
 *
 * @example
 * ```typescript
 * import { sdkCache, CACHE_TTL } from '@migratefun/sdk';
 *
 * // Cache project config
 * sdkCache.set('project:my-id', config, CACHE_TTL.PROJECT_CONFIG);
 *
 * // Retrieve from cache
 * const config = sdkCache.get('project:my-id');
 * ```
 */
declare const sdkCache: Cache<any>;
/**
 * RPC request throttler to prevent rate limiting
 *
 * Enforces minimum delay between RPC requests.
 *
 * @example
 * ```typescript
 * const throttle = new Throttle(100); // 100ms minimum between requests
 *
 * await throttle.wait(); // Waits if needed
 * const result = await connection.getAccountInfo(address);
 * ```
 */
declare class Throttle {
    private lastRequestTime;
    private minDelay;
    /**
     * Create a new throttle instance
     *
     * @param {number} [minDelay=100] - Minimum delay between requests in milliseconds
     */
    constructor(minDelay?: number);
    /**
     * Wait if necessary to enforce minimum delay
     *
     * @returns {Promise<void>} Resolves when it's safe to make the next request
     */
    wait(): Promise<void>;
    /**
     * Reset the throttle timer
     */
    reset(): void;
}
/**
 * Global RPC throttle instance
 *
 * Used internally to throttle RPC requests and avoid rate limits.
 *
 * @example
 * ```typescript
 * import { rpcThrottle } from '@migratefun/sdk';
 *
 * // Wait before making RPC request
 * await rpcThrottle.wait();
 * const balance = await connection.getBalance(publicKey);
 * ```
 */
declare const rpcThrottle: Throttle;
/**
 * Helper to get cached data or fetch if not available
 *
 * @template T
 * @param {string} key - Cache key
 * @param {() => Promise<T>} fetcher - Function to fetch data if not cached
 * @param {number} [ttl] - Time to live in milliseconds
 * @returns {Promise<T>} Cached or freshly fetched data
 *
 * @example
 * ```typescript
 * import { getCached, CACHE_TTL } from '@migratefun/sdk';
 *
 * const config = await getCached(
 *   'project:my-id',
 *   async () => {
 *     const [pda] = getProjectConfigPda('my-id');
 *     return await program.account.projectConfig.fetch(pda);
 *   },
 *   CACHE_TTL.PROJECT_CONFIG
 * );
 * ```
 */
declare function getCached<T>(key: string, fetcher: () => Promise<T>, ttl?: number): Promise<T>;
/**
 * Memoize a function with argument-based caching
 *
 * @template Args, Return
 * @param {(...args: Args) => Return} fn - Function to memoize
 * @param {number} [ttl] - Cache TTL in milliseconds
 * @returns {(...args: Args) => Return} Memoized function
 *
 * @example
 * ```typescript
 * import { memoize } from '@migratefun/sdk';
 *
 * const expensiveCalc = memoize((a: number, b: number) => {
 *   console.log('Computing...');
 *   return a * b;
 * }, 60000);
 *
 * expensiveCalc(5, 10); // Computing... => 50
 * expensiveCalc(5, 10); // (cached) => 50
 * ```
 */
declare function memoize<Args extends any[], Return>(fn: (...args: Args) => Return, ttl?: number): (...args: Args) => Return;
/**
 * Async version of memoize
 *
 * @template Args, Return
 * @param {(...args: Args) => Promise<Return>} fn - Async function to memoize
 * @param {number} [ttl] - Cache TTL in milliseconds
 * @returns {(...args: Args) => Promise<Return>} Memoized async function
 *
 * @example
 * ```typescript
 * import { memoizeAsync, CACHE_TTL } from '@migratefun/sdk';
 *
 * const fetchProject = memoizeAsync(
 *   async (id: string) => {
 *     const [pda] = getProjectConfigPda(id);
 *     return await program.account.projectConfig.fetch(pda);
 *   },
 *   CACHE_TTL.PROJECT_CONFIG
 * );
 *
 * await fetchProject('my-id'); // Fetches from chain
 * await fetchProject('my-id'); // Returns cached
 * ```
 */
declare function memoizeAsync<Args extends any[], Return>(fn: (...args: Args) => Promise<Return>, ttl?: number): (...args: Args) => Promise<Return>;
/**
 * Create a cache key from multiple parts
 *
 * @param {...any[]} parts - Parts to combine into a cache key
 * @returns {string} Combined cache key
 *
 * @example
 * ```typescript
 * import { createCacheKey } from '@migratefun/sdk';
 *
 * const key = createCacheKey('balance', projectId, userPubkey.toBase58());
 * // => "balance:my-project:7xKX...ABC"
 * ```
 */
declare function createCacheKey(...parts: any[]): string;
/**
 * Delay execution for a specified time
 *
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise<void>} Promise that resolves after the delay
 *
 * @example
 * ```typescript
 * import { delay } from '@migratefun/sdk';
 *
 * await delay(1000); // Wait 1 second
 * console.log('Done waiting');
 * ```
 */
declare function delay(ms: number): Promise<void>;

export { BalanceSnapshot, type BuildClaimMftTxOptions, type BuildClaimMftTxResult, type BuildMigrateTxOptions, type BuildMigrateTxResult, CACHE_TTL, Cache, type GetBalancesOptions, type GetProgramOptions, type HustleMigrationIdl, IdlSource, type LoadProjectOptions, LoadedProject, Network, PROGRAM_ID, type PdaOptions, SdkError, Throttle, type UnsubscribeFn, type WatchBalancesOptions, _resetCache, buildClaimMftTx, buildMigrateTx, createCacheKey, delay, formatErrorForLog, formatTokenAmount, getActiveNetwork, getBalances, getCached, getErrorDetails, getIdl, getLpVaultPda, getMftMintPda, getNewTokenVaultPda, getOldTokenVaultPda, getPlatformConfigPda, getPlatformFeeVaultPda, getProgram, getProgramId, getProjectConfigPda, getProjectPdas, getQuoteTokenVaultPda, getRegistryPda, getUserAta, getUserMigrationPda, getWsolVaultPda, isProjectActive, isProjectPaused, isRetryableError, loadProject, memoize, memoizeAsync, parseError, parseTokenAmount, resolveNetwork, rpcThrottle, sdkCache, sendAndConfirmTransaction, setActiveNetwork, simulateTransaction, watchBalances };
