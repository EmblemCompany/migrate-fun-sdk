import { useState, useRef, useCallback, useEffect } from 'react';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync } from '@solana/spl-token';
import { AnchorProvider, BN, Program } from '@coral-xyz/anchor';
import { PublicKey, Transaction, Connection } from '@solana/web3.js';

// react/useLoadedProject.ts

// idl/dev/devnet_hustle_migration.json
var devnet_hustle_migration_default = {
  address: "migK824DsBMp2eZXdhSBAWFS6PbvA6UN8DV15HfmstR",
  metadata: {
    name: "hustle_migration",
    version: "0.1.0",
    spec: "0.1.0",
    description: "Created with Anchor"
  },
  instructions: [
    {
      name: "accept_platform_admin",
      discriminator: [138, 66, 59, 92, 174, 222, 99, 82],
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
      args: []
    },
    {
      name: "burn_lp_portion",
      discriminator: [79, 149, 82, 188, 51, 208, 169, 210],
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
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
          docs: ["LP token vault that holds the tokens to burn"],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [108, 112, 95, 118, 97, 117, 108, 116]
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
          docs: ["LP token mint"],
          writable: true
        },
        {
          name: "admin",
          writable: true,
          signer: true,
          relations: ["project_config"]
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
      discriminator: [33, 29, 16, 173, 148, 158, 171, 232],
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
      args: []
    },
    {
      name: "claim_fees",
      discriminator: [82, 251, 233, 156, 12, 52, 184, 202],
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
      args: []
    },
    {
      name: "claim_refund",
      discriminator: [15, 16, 30, 161, 255, 228, 97, 60],
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
                value: [109, 102, 116, 95, 109, 105, 110, 116]
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
      discriminator: [42, 70, 30, 26, 71, 71, 164, 16],
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
              array: ["u8", 32]
            }
          }
        }
      ]
    },
    {
      name: "claim_with_mft",
      discriminator: [232, 162, 178, 244, 170, 169, 199, 205],
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
                value: [109, 102, 116, 95, 109, 105, 110, 116]
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
      discriminator: [233, 146, 209, 142, 207, 104, 64, 188],
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
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
                value: [108, 112, 95, 118, 97, 117, 108, 116]
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
          docs: ["Raydium validates this internally during initialization"],
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
                value: [109, 102, 116, 95, 109, 105, 110, 116]
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
      discriminator: [148, 219, 181, 42, 221, 114, 145, 190],
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
                value: [108, 112, 95, 118, 97, 117, 108, 116]
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
                value: [109, 102, 116, 95, 109, 105, 110, 116]
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
      discriminator: [32, 217, 77, 209, 89, 36, 65, 35],
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
      discriminator: [140, 243, 212, 140, 193, 80, 18, 93],
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
      discriminator: [239, 45, 203, 64, 150, 73, 218, 92],
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
      discriminator: [56, 47, 60, 155, 110, 73, 10, 82],
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
      discriminator: [148, 202, 88, 125, 45, 237, 53, 217],
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
      discriminator: [119, 201, 101, 45, 75, 122, 89, 3],
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
      discriminator: [69, 126, 215, 37, 20, 60, 73, 235],
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
                value: [109, 102, 116, 95, 109, 105, 110, 116]
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
                value: [109, 101, 116, 97, 100, 97, 116, 97]
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
      discriminator: [3, 178, 114, 147, 42, 176, 61, 41],
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
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
      discriminator: [227, 184, 213, 217, 1, 53, 5, 222],
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
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
      discriminator: [18, 185, 26, 145, 206, 63, 88, 11],
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
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
                value: [108, 112, 95, 118, 97, 117, 108, 116]
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
      discriminator: [222, 248, 124, 133, 151, 167, 195, 234],
      accounts: [
        {
          name: "admin",
          writable: true,
          signer: true,
          relations: ["project_config"]
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
      discriminator: [155, 234, 231, 146, 236, 158, 162, 30],
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
                value: [109, 102, 116, 95, 109, 105, 110, 116]
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
      discriminator: [8, 68, 240, 82, 45, 162, 129, 230],
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
      discriminator: [26, 187, 5, 155, 78, 207, 193, 4],
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
      discriminator: [145, 250, 67, 46, 166, 179, 123, 166],
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
      discriminator: [43, 24, 91, 60, 240, 137, 28, 102],
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
            array: ["u8", 32]
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
      discriminator: [167, 126, 170, 252, 248, 123, 88, 46],
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
      discriminator: [232, 253, 195, 247, 148, 212, 73, 222],
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
      discriminator: [195, 60, 76, 129, 146, 45, 67, 143],
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
      discriminator: [150, 218, 97, 90, 149, 210, 11, 76],
      accounts: [
        {
          name: "current_admin",
          docs: ["Current admin who is transferring control"],
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
          docs: ["The project config being updated"],
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
      discriminator: [164, 33, 234, 53, 111, 225, 13, 220],
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
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
  ],
  accounts: [
    {
      name: "PlatformAdminCandidate",
      discriminator: [179, 153, 14, 240, 164, 64, 193, 227]
    },
    {
      name: "PlatformConfig",
      discriminator: [160, 78, 128, 0, 248, 83, 230, 160]
    },
    {
      name: "PoolConfig",
      discriminator: [26, 108, 14, 123, 116, 230, 129, 43]
    },
    {
      name: "ProjectConfig",
      discriminator: [187, 239, 0, 110, 5, 15, 245, 65]
    },
    {
      name: "UserMerkleClaim",
      discriminator: [186, 112, 216, 254, 119, 63, 93, 26]
    },
    {
      name: "UserMigration",
      discriminator: [219, 194, 245, 85, 15, 214, 204, 163]
    }
  ],
  events: [
    {
      name: "AdminLpLocked",
      discriminator: [193, 201, 47, 36, 204, 224, 59, 6]
    },
    {
      name: "AdminUpdatedEvent",
      discriminator: [87, 146, 113, 247, 187, 52, 223, 11]
    },
    {
      name: "BonkFunLpLocked",
      discriminator: [20, 73, 36, 53, 20, 133, 127, 30]
    },
    {
      name: "ClaimsEnabled",
      discriminator: [27, 116, 118, 179, 171, 8, 66, 137]
    },
    {
      name: "CommitmentSet",
      discriminator: [245, 41, 85, 83, 205, 224, 0, 143]
    },
    {
      name: "CommitmentToppedUp",
      discriminator: [227, 116, 148, 84, 22, 51, 244, 93]
    },
    {
      name: "CpmmPoolCreated",
      discriminator: [238, 103, 157, 230, 65, 143, 8, 79]
    },
    {
      name: "EmergencyWithdrawEvent",
      discriminator: [177, 61, 254, 20, 145, 18, 188, 237]
    },
    {
      name: "ErrorOccurred",
      discriminator: [45, 168, 251, 0, 254, 251, 21, 128]
    },
    {
      name: "FailedMigrationFinalized",
      discriminator: [192, 62, 91, 253, 252, 62, 83, 165]
    },
    {
      name: "FailedMigrationSolClaimed",
      discriminator: [192, 199, 24, 10, 167, 85, 91, 108]
    },
    {
      name: "LpBurned",
      discriminator: [7, 184, 215, 76, 200, 54, 6, 56]
    },
    {
      name: "LpLockVerified",
      discriminator: [210, 22, 111, 138, 195, 157, 212, 18]
    },
    {
      name: "LpTokensClaimed",
      discriminator: [238, 34, 104, 0, 111, 229, 74, 213]
    },
    {
      name: "LpTokensLockedEvent",
      discriminator: [70, 53, 97, 39, 58, 231, 247, 120]
    },
    {
      name: "LpTokensLockedWithStreamflow",
      discriminator: [234, 148, 130, 141, 225, 66, 122, 46]
    },
    {
      name: "MerkleClaimed",
      discriminator: [77, 94, 88, 168, 214, 30, 68, 0]
    },
    {
      name: "MerkleRootSet",
      discriminator: [71, 89, 215, 23, 123, 11, 135, 16]
    },
    {
      name: "MftClaimed",
      discriminator: [154, 250, 129, 96, 101, 241, 0, 122]
    },
    {
      name: "MigrationEvent",
      discriminator: [255, 202, 76, 147, 91, 231, 73, 22]
    },
    {
      name: "MigrationFailed",
      discriminator: [134, 211, 211, 164, 161, 159, 212, 139]
    },
    {
      name: "MigrationFailureDeclared",
      discriminator: [92, 115, 82, 220, 207, 115, 85, 140]
    },
    {
      name: "MigrationSucceeded",
      discriminator: [216, 199, 203, 122, 112, 232, 183, 14]
    },
    {
      name: "MigrationSucceededEarly",
      discriminator: [213, 192, 145, 53, 110, 181, 76, 123]
    },
    {
      name: "NewTokensDeposited",
      discriminator: [15, 104, 21, 168, 240, 171, 155, 89]
    },
    {
      name: "PartialSwapEvent",
      discriminator: [121, 231, 249, 10, 235, 136, 126, 205]
    },
    {
      name: "PlatformConfigUpdated",
      discriminator: [198, 206, 187, 204, 148, 251, 237, 25]
    },
    {
      name: "PlatformFeesClaimedEvent",
      discriminator: [253, 217, 84, 147, 249, 44, 26, 35]
    },
    {
      name: "PlatformInitialized",
      discriminator: [16, 222, 212, 5, 213, 140, 112, 162]
    },
    {
      name: "ProjectCreatedEvent",
      discriminator: [211, 119, 21, 209, 113, 178, 141, 38]
    },
    {
      name: "ProjectCreationFeeCollected",
      discriminator: [88, 9, 14, 213, 25, 213, 28, 118]
    },
    {
      name: "ProjectEmergencyWithdrawToggled",
      discriminator: [195, 54, 114, 114, 143, 222, 164, 67]
    },
    {
      name: "ProjectFeeUpdated",
      discriminator: [49, 83, 247, 111, 97, 41, 250, 81]
    },
    {
      name: "ProjectFinalized",
      discriminator: [206, 140, 138, 3, 23, 210, 23, 204]
    },
    {
      name: "ProjectInitialized",
      discriminator: [222, 194, 81, 9, 16, 183, 224, 22]
    },
    {
      name: "ProjectInitializedEvent",
      discriminator: [199, 63, 149, 189, 143, 15, 56, 253]
    },
    {
      name: "ProjectPaused",
      discriminator: [126, 250, 145, 29, 201, 145, 236, 173]
    },
    {
      name: "PumpFunTokenCreated",
      discriminator: [228, 29, 83, 133, 132, 70, 38, 131]
    },
    {
      name: "RefundClaimed",
      discriminator: [136, 64, 242, 99, 4, 244, 208, 130]
    },
    {
      name: "SolRefundClaimed",
      discriminator: [184, 234, 43, 249, 123, 73, 253, 176]
    },
    {
      name: "SwapWarning",
      discriminator: [193, 56, 83, 255, 91, 236, 18, 49]
    },
    {
      name: "TokenMarkedAsCreated",
      discriminator: [96, 236, 103, 52, 129, 34, 221, 41]
    },
    {
      name: "TokenMigrated",
      discriminator: [109, 61, 145, 107, 50, 158, 28, 154]
    },
    {
      name: "TokenSwappedToQuote",
      discriminator: [247, 7, 255, 108, 157, 48, 140, 19]
    },
    {
      name: "TransferredToClaims",
      discriminator: [5, 238, 85, 97, 140, 132, 252, 47]
    },
    {
      name: "UnclaimedAssetsRecovered",
      discriminator: [42, 183, 43, 222, 11, 234, 142, 46]
    },
    {
      name: "UnclaimedFailureRecovered",
      discriminator: [129, 54, 143, 170, 57, 120, 102, 5]
    }
  ],
  errors: [
    {
      code: 6e3,
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
  ],
  types: [
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
              array: ["u8", 32]
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
              array: ["u8", 32]
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
  ]
};

// idl/mainnet/mainnet_hustle_migration.json
var mainnet_hustle_migration_default = {
  address: "migK824DsBMp2eZXdhSBAWFS6PbvA6UN8DV15HfmstR",
  metadata: {
    name: "hustle_migration",
    version: "0.1.0",
    spec: "0.1.0",
    description: "Created with Anchor"
  },
  instructions: [
    {
      name: "burn_lp_portion",
      discriminator: [79, 149, 82, 188, 51, 208, 169, 210],
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
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
          docs: ["LP token vault that holds the tokens to burn"],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [108, 112, 95, 118, 97, 117, 108, 116]
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
          docs: ["LP token mint"],
          writable: true
        },
        {
          name: "admin",
          writable: true,
          signer: true,
          relations: ["project_config"]
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
      discriminator: [82, 251, 233, 156, 12, 52, 184, 202],
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
      args: []
    },
    {
      name: "claim_refund",
      discriminator: [15, 16, 30, 161, 255, 228, 97, 60],
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
                value: [109, 102, 116, 95, 109, 105, 110, 116]
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
      discriminator: [42, 70, 30, 26, 71, 71, 164, 16],
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
              array: ["u8", 32]
            }
          }
        }
      ]
    },
    {
      name: "claim_with_mft",
      discriminator: [232, 162, 178, 244, 170, 169, 199, 205],
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
                value: [109, 102, 116, 95, 109, 105, 110, 116]
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
      discriminator: [233, 146, 209, 142, 207, 104, 64, 188],
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
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
                value: [108, 112, 95, 118, 97, 117, 108, 116]
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
          docs: ["Raydium validates this internally during initialization"],
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
                value: [109, 102, 116, 95, 109, 105, 110, 116]
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
      discriminator: [148, 219, 181, 42, 221, 114, 145, 190],
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
                value: [108, 112, 95, 118, 97, 117, 108, 116]
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
                value: [109, 102, 116, 95, 109, 105, 110, 116]
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
      discriminator: [140, 243, 212, 140, 193, 80, 18, 93],
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
      discriminator: [239, 45, 203, 64, 150, 73, 218, 92],
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
      discriminator: [56, 47, 60, 155, 110, 73, 10, 82],
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
      discriminator: [148, 202, 88, 125, 45, 237, 53, 217],
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
      discriminator: [119, 201, 101, 45, 75, 122, 89, 3],
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
      discriminator: [69, 126, 215, 37, 20, 60, 73, 235],
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
                value: [109, 102, 116, 95, 109, 105, 110, 116]
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
                value: [109, 101, 116, 97, 100, 97, 116, 97]
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
      discriminator: [3, 178, 114, 147, 42, 176, 61, 41],
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
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
      discriminator: [227, 184, 213, 217, 1, 53, 5, 222],
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
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
      discriminator: [18, 185, 26, 145, 206, 63, 88, 11],
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
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
                value: [108, 112, 95, 118, 97, 117, 108, 116]
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
      discriminator: [222, 248, 124, 133, 151, 167, 195, 234],
      accounts: [
        {
          name: "admin",
          writable: true,
          signer: true,
          relations: ["project_config"]
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
      discriminator: [155, 234, 231, 146, 236, 158, 162, 30],
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
                value: [109, 102, 116, 95, 109, 105, 110, 116]
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
      discriminator: [8, 68, 240, 82, 45, 162, 129, 230],
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
      discriminator: [145, 250, 67, 46, 166, 179, 123, 166],
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
      discriminator: [43, 24, 91, 60, 240, 137, 28, 102],
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
            array: ["u8", 32]
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
      discriminator: [167, 126, 170, 252, 248, 123, 88, 46],
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
      discriminator: [232, 253, 195, 247, 148, 212, 73, 222],
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
      discriminator: [195, 60, 76, 129, 146, 45, 67, 143],
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
      discriminator: [164, 33, 234, 53, 111, 225, 13, 220],
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
                value: [112, 111, 111, 108, 95, 99, 111, 110, 102, 105, 103]
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
  ],
  accounts: [
    {
      name: "PlatformConfig",
      discriminator: [160, 78, 128, 0, 248, 83, 230, 160]
    },
    {
      name: "PoolConfig",
      discriminator: [26, 108, 14, 123, 116, 230, 129, 43]
    },
    {
      name: "ProjectConfig",
      discriminator: [187, 239, 0, 110, 5, 15, 245, 65]
    },
    {
      name: "UserMerkleClaim",
      discriminator: [186, 112, 216, 254, 119, 63, 93, 26]
    },
    {
      name: "UserMigration",
      discriminator: [219, 194, 245, 85, 15, 214, 204, 163]
    }
  ],
  events: [
    {
      name: "AdminLpLocked",
      discriminator: [193, 201, 47, 36, 204, 224, 59, 6]
    },
    {
      name: "BonkFunLpLocked",
      discriminator: [20, 73, 36, 53, 20, 133, 127, 30]
    },
    {
      name: "ClaimsEnabled",
      discriminator: [27, 116, 118, 179, 171, 8, 66, 137]
    },
    {
      name: "CommitmentSet",
      discriminator: [245, 41, 85, 83, 205, 224, 0, 143]
    },
    {
      name: "CommitmentToppedUp",
      discriminator: [227, 116, 148, 84, 22, 51, 244, 93]
    },
    {
      name: "CpmmPoolCreated",
      discriminator: [238, 103, 157, 230, 65, 143, 8, 79]
    },
    {
      name: "EmergencyWithdrawEvent",
      discriminator: [177, 61, 254, 20, 145, 18, 188, 237]
    },
    {
      name: "ErrorOccurred",
      discriminator: [45, 168, 251, 0, 254, 251, 21, 128]
    },
    {
      name: "FailedMigrationFinalized",
      discriminator: [192, 62, 91, 253, 252, 62, 83, 165]
    },
    {
      name: "FailedMigrationSolClaimed",
      discriminator: [192, 199, 24, 10, 167, 85, 91, 108]
    },
    {
      name: "LpBurned",
      discriminator: [7, 184, 215, 76, 200, 54, 6, 56]
    },
    {
      name: "LpLockVerified",
      discriminator: [210, 22, 111, 138, 195, 157, 212, 18]
    },
    {
      name: "LpTokensClaimed",
      discriminator: [238, 34, 104, 0, 111, 229, 74, 213]
    },
    {
      name: "LpTokensLockedEvent",
      discriminator: [70, 53, 97, 39, 58, 231, 247, 120]
    },
    {
      name: "LpTokensLockedWithStreamflow",
      discriminator: [234, 148, 130, 141, 225, 66, 122, 46]
    },
    {
      name: "MerkleClaimed",
      discriminator: [77, 94, 88, 168, 214, 30, 68, 0]
    },
    {
      name: "MerkleRootSet",
      discriminator: [71, 89, 215, 23, 123, 11, 135, 16]
    },
    {
      name: "MftClaimed",
      discriminator: [154, 250, 129, 96, 101, 241, 0, 122]
    },
    {
      name: "MigrationEvent",
      discriminator: [255, 202, 76, 147, 91, 231, 73, 22]
    },
    {
      name: "MigrationFailed",
      discriminator: [134, 211, 211, 164, 161, 159, 212, 139]
    },
    {
      name: "MigrationFailureDeclared",
      discriminator: [92, 115, 82, 220, 207, 115, 85, 140]
    },
    {
      name: "MigrationSucceeded",
      discriminator: [216, 199, 203, 122, 112, 232, 183, 14]
    },
    {
      name: "MigrationSucceededEarly",
      discriminator: [213, 192, 145, 53, 110, 181, 76, 123]
    },
    {
      name: "NewTokensDeposited",
      discriminator: [15, 104, 21, 168, 240, 171, 155, 89]
    },
    {
      name: "PartialSwapEvent",
      discriminator: [121, 231, 249, 10, 235, 136, 126, 205]
    },
    {
      name: "PlatformConfigUpdated",
      discriminator: [198, 206, 187, 204, 148, 251, 237, 25]
    },
    {
      name: "PlatformFeesClaimedEvent",
      discriminator: [253, 217, 84, 147, 249, 44, 26, 35]
    },
    {
      name: "PlatformInitialized",
      discriminator: [16, 222, 212, 5, 213, 140, 112, 162]
    },
    {
      name: "ProjectCreatedEvent",
      discriminator: [211, 119, 21, 209, 113, 178, 141, 38]
    },
    {
      name: "ProjectCreationFeeCollected",
      discriminator: [88, 9, 14, 213, 25, 213, 28, 118]
    },
    {
      name: "ProjectEmergencyWithdrawToggled",
      discriminator: [195, 54, 114, 114, 143, 222, 164, 67]
    },
    {
      name: "ProjectFeeUpdated",
      discriminator: [49, 83, 247, 111, 97, 41, 250, 81]
    },
    {
      name: "ProjectFinalized",
      discriminator: [206, 140, 138, 3, 23, 210, 23, 204]
    },
    {
      name: "ProjectInitialized",
      discriminator: [222, 194, 81, 9, 16, 183, 224, 22]
    },
    {
      name: "ProjectInitializedEvent",
      discriminator: [199, 63, 149, 189, 143, 15, 56, 253]
    },
    {
      name: "ProjectPaused",
      discriminator: [126, 250, 145, 29, 201, 145, 236, 173]
    },
    {
      name: "RefundClaimed",
      discriminator: [136, 64, 242, 99, 4, 244, 208, 130]
    },
    {
      name: "SolRefundClaimed",
      discriminator: [184, 234, 43, 249, 123, 73, 253, 176]
    },
    {
      name: "SwapWarning",
      discriminator: [193, 56, 83, 255, 91, 236, 18, 49]
    },
    {
      name: "TokenMarkedAsCreated",
      discriminator: [96, 236, 103, 52, 129, 34, 221, 41]
    },
    {
      name: "TokenMigrated",
      discriminator: [109, 61, 145, 107, 50, 158, 28, 154]
    },
    {
      name: "TokenSwappedToQuote",
      discriminator: [247, 7, 255, 108, 157, 48, 140, 19]
    },
    {
      name: "TransferredToClaims",
      discriminator: [5, 238, 85, 97, 140, 132, 252, 47]
    },
    {
      name: "UnclaimedAssetsRecovered",
      discriminator: [42, 183, 43, 222, 11, 234, 142, 46]
    },
    {
      name: "UnclaimedFailureRecovered",
      discriminator: [129, 54, 143, 170, 57, 120, 102, 5]
    }
  ],
  errors: [
    {
      code: 6e3,
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
  ],
  types: [
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
              array: ["u8", 32]
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
              array: ["u8", 32]
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
  ]
};

// src/program.ts
var cacheByNetwork = /* @__PURE__ */ new Map();
var activeNetwork = null;
function normalizeIdlAccounts(idl) {
  if (!Array.isArray(idl.accounts) || !Array.isArray(idl.types)) {
    return idl;
  }
  const typeMap = /* @__PURE__ */ new Map();
  for (const typeDef of idl.types) {
    if (typeDef?.name) {
      typeMap.set(typeDef.name.toLowerCase(), typeDef);
    }
  }
  let didChange = false;
  const accounts = idl.accounts.map((account) => {
    if (account?.type) {
      return account;
    }
    const typeDef = typeMap.get(account.name.toLowerCase());
    if (!typeDef?.type) {
      return account;
    }
    didChange = true;
    return {
      ...account,
      type: typeDef.type,
      docs: account.docs ?? typeDef.docs
    };
  });
  if (!didChange) {
    return idl;
  }
  return {
    ...idl,
    accounts
  };
}
function resolveNetwork(explicit) {
  const envNetwork = typeof process !== "undefined" && process.env?.SOLANA_NETWORK || typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SOLANA_NETWORK;
  const candidate = (typeof envNetwork === "string" ? envNetwork.toLowerCase() : "devnet") || "devnet";
  if (candidate === "mainnet" || candidate === "mainnet-beta") {
    return "mainnet-beta";
  }
  if (candidate === "devnet") {
    return "devnet";
  }
  throw new Error(
    `Unsupported Solana network "${candidate}" for migration program.
Set SOLANA_NETWORK (or NEXT_PUBLIC_SOLANA_NETWORK) to devnet or mainnet-beta.`
  );
}
function loadIdl(networkOverride) {
  const network = networkOverride ?? activeNetwork ?? resolveNetwork();
  if (cacheByNetwork.has(network)) {
    activeNetwork = network;
    return cacheByNetwork.get(network);
  }
  const source = network === "mainnet-beta" ? mainnet_hustle_migration_default : devnet_hustle_migration_default;
  const normalizedSource = normalizeIdlAccounts(source);
  const programOverride = typeof process !== "undefined" && process.env?.MIGRATION_PROGRAM_OVERRIDE;
  const programAddress = (typeof programOverride === "string" ? programOverride.trim() : source.address) || source.address;
  const programId = new PublicKey(programAddress);
  const idl = {
    ...normalizedSource,
    address: programAddress,
    __migrationIdl: true
  };
  const cached = { network, idl, programId };
  cacheByNetwork.set(network, cached);
  activeNetwork = network;
  return cached;
}
function getProgramId(network) {
  return loadIdl(network).programId;
}
getProgramId();
async function getProgram(connectionOrProvider, options = {}) {
  const { network, idlSource = "bundle" } = options;
  const { idl, programId } = loadIdl(network);
  const provider = connectionOrProvider instanceof Connection ? new AnchorProvider(
    connectionOrProvider,
    {},
    // No wallet needed for read-only operations
    { commitment: "confirmed" }
  ) : connectionOrProvider;
  if (idlSource === "bundle") {
    return new Program(idl, provider);
  }
  try {
    const onchainIdl = await Program.fetchIdl(programId, provider);
    if (onchainIdl) {
      return new Program(onchainIdl, provider);
    }
  } catch (error) {
    console.warn(
      "[migrate.fun SDK] Failed to fetch on-chain IDL, falling back to bundled version:",
      error
    );
  }
  return new Program(idl, provider);
}
var SEEDS = {
  PROJECT_CONFIG: Buffer.from("project_config"),
  OLD_TOKEN_VAULT: Buffer.from("old_token_vault"),
  NEW_TOKEN_VAULT: Buffer.from("new_token_vault"),
  PROJECT_WSOL_VAULT: Buffer.from("project_wsol_vault"),
  PROJECT_REGISTRY: Buffer.from("project_registry"),
  PLATFORM_CONFIG: Buffer.from("platform_config"),
  PLATFORM_FEE_VAULT: Buffer.from([
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
  ]),
  QUOTE_TOKEN_VAULT: Buffer.from("quote_token_vault"),
  LP_VAULT: Buffer.from("lp_vault"),
  MFT_MINT: Buffer.from("mft_mint"),
  USER_MIGRATION: Buffer.from("user_migration")
};
function getProjectConfigPda(projectId, options = {}) {
  const programId = getProgramId(options.network);
  return PublicKey.findProgramAddressSync(
    [SEEDS.PROJECT_CONFIG, Buffer.from(projectId)],
    programId
  );
}
function getOldTokenVaultPda(projectId, options = {}) {
  const programId = getProgramId(options.network);
  return PublicKey.findProgramAddressSync(
    [SEEDS.OLD_TOKEN_VAULT, Buffer.from(projectId)],
    programId
  );
}
function getNewTokenVaultPda(projectId, options = {}) {
  const programId = getProgramId(options.network);
  return PublicKey.findProgramAddressSync(
    [SEEDS.NEW_TOKEN_VAULT, Buffer.from(projectId)],
    programId
  );
}
function getWsolVaultPda(projectId, options = {}) {
  const programId = getProgramId(options.network);
  return PublicKey.findProgramAddressSync(
    [SEEDS.PROJECT_WSOL_VAULT, Buffer.from(projectId)],
    programId
  );
}
function getQuoteTokenVaultPda(projectId, options = {}) {
  const programId = getProgramId(options.network);
  return PublicKey.findProgramAddressSync(
    [SEEDS.QUOTE_TOKEN_VAULT, Buffer.from(projectId)],
    programId
  );
}
function getMftMintPda(projectId, options = {}) {
  const programId = getProgramId(options.network);
  return PublicKey.findProgramAddressSync([SEEDS.MFT_MINT, Buffer.from(projectId)], programId);
}
function getLpVaultPda(projectId, options = {}) {
  const programId = getProgramId(options.network);
  return PublicKey.findProgramAddressSync([SEEDS.LP_VAULT, Buffer.from(projectId)], programId);
}
function getUserAta(user, mint, tokenProgram = TOKEN_PROGRAM_ID) {
  return getAssociatedTokenAddressSync(
    mint,
    user,
    false,
    // allowOwnerOffCurve
    tokenProgram
  );
}
function getProjectPdas(projectId, options = {}) {
  const [projectConfig] = getProjectConfigPda(projectId, options);
  const [oldTokenVault] = getOldTokenVaultPda(projectId, options);
  const [newTokenVault] = getNewTokenVaultPda(projectId, options);
  const [mftMint] = getMftMintPda(projectId, options);
  const [wsolVault] = getWsolVaultPda(projectId, options);
  const [quoteTokenVault] = getQuoteTokenVaultPda(projectId, options);
  const [lpVault] = getLpVaultPda(projectId, options);
  return {
    projectConfig,
    oldTokenVault,
    newTokenVault,
    mftMint,
    wsolVault,
    quoteTokenVault,
    lpVault
  };
}

// src/types.ts
var SdkError = class _SdkError extends Error {
  constructor(code, message, originalError) {
    super(message);
    this.code = code;
    this.originalError = originalError;
    this.name = "SdkError";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, _SdkError);
    }
  }
};

// src/utils/cache.ts
var CACHE_TTL = {
  /** Balance queries - 30 seconds */
  BALANCES: 3e4,
  /** Token metadata - 5 minutes */
  METADATA: 3e5,
  /** Project configurations - 1 hour */
  PROJECT_CONFIG: 36e5,
  /** Token supplies - 30 seconds */
  SUPPLY: 3e4,
  /** Account info - 10 seconds */
  ACCOUNT_INFO: 1e4
};
var Cache = class {
  /**
   * Create a new cache instance
   *
   * @param {number} [defaultTTL=30000] - Default TTL in milliseconds
   */
  constructor(defaultTTL = 3e4) {
    this.cache = /* @__PURE__ */ new Map();
    this.defaultTTL = defaultTTL;
  }
  /**
   * Store a value in the cache
   *
   * @param {string} key - Cache key
   * @param {T} data - Data to cache
   * @param {number} [ttl] - Time to live in milliseconds (defaults to instance default)
   */
  set(key, data, ttl) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl ?? this.defaultTTL
    });
  }
  /**
   * Retrieve a value from the cache
   *
   * @param {string} key - Cache key
   * @returns {T | null} Cached value or null if not found/expired
   */
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }
  /**
   * Check if a key exists and is not expired
   *
   * @param {string} key - Cache key
   * @returns {boolean} True if key exists and is valid
   */
  has(key) {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }
  /**
   * Remove a specific key from the cache
   *
   * @param {string} key - Cache key to delete
   */
  delete(key) {
    this.cache.delete(key);
  }
  /**
   * Clear all cached values
   */
  clear() {
    this.cache.clear();
  }
  /**
   * Get the number of cached entries
   *
   * @returns {number} Number of cached entries
   */
  size() {
    return this.cache.size;
  }
};
var sdkCache = new Cache();
var Throttle = class {
  /**
   * Create a new throttle instance
   *
   * @param {number} [minDelay=100] - Minimum delay between requests in milliseconds
   */
  constructor(minDelay = 100) {
    this.lastRequestTime = 0;
    this.minDelay = minDelay;
  }
  /**
   * Wait if necessary to enforce minimum delay
   *
   * @returns {Promise<void>} Resolves when it's safe to make the next request
   */
  async wait() {
    const now = Date.now();
    const elapsed = now - this.lastRequestTime;
    if (elapsed < this.minDelay) {
      const delay = this.minDelay - elapsed;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    this.lastRequestTime = Date.now();
  }
  /**
   * Reset the throttle timer
   */
  reset() {
    this.lastRequestTime = 0;
  }
};
var rpcThrottle = new Throttle(100);
function createCacheKey(...parts) {
  return parts.map((part) => {
    if (typeof part === "string") return part;
    if (typeof part === "number") return part.toString();
    if (part?.toBase58) return part.toBase58();
    return JSON.stringify(part);
  }).join(":");
}

// src/balances.ts
async function loadProject(projectId, connection, options = {}) {
  const { network, skipCache = false } = options;
  const cacheKey = createCacheKey("project", projectId, network || "default");
  if (!skipCache) {
    const cached = sdkCache.get(cacheKey);
    if (cached) {
      return cached;
    }
  }
  try {
    await rpcThrottle.wait();
    const program = await getProgram(connection, { network });
    const [projectConfigPda] = getProjectConfigPda(projectId, { network });
    const projectConfig = await program.account.projectConfig.fetch(projectConfigPda);
    if (!projectConfig) {
      throw new SdkError(
        "PROJECT_NOT_FOUND" /* PROJECT_NOT_FOUND */,
        `Project "${projectId}" not found on chain`
      );
    }
    await rpcThrottle.wait();
    const oldTokenMintInfo = await connection.getParsedAccountInfo(
      projectConfig.oldTokenMint
    );
    const oldTokenDecimals = oldTokenMintInfo.value?.data && "parsed" in oldTokenMintInfo.value.data && typeof oldTokenMintInfo.value.data.parsed.info.decimals === "number" ? oldTokenMintInfo.value.data.parsed.info.decimals : 9;
    await rpcThrottle.wait();
    const newTokenMintInfo = await connection.getParsedAccountInfo(
      projectConfig.newTokenMint
    );
    const newTokenDecimals = newTokenMintInfo.value?.data && "parsed" in newTokenMintInfo.value.data && typeof newTokenMintInfo.value.data.parsed.info.decimals === "number" ? newTokenMintInfo.value.data.parsed.info.decimals : 9;
    const mftDecimals = 9;
    const pdas = getProjectPdas(projectId, { network });
    const now = Date.now() / 1e3;
    const startTs = projectConfig.startTs.toNumber ? projectConfig.startTs.toNumber() : Number(projectConfig.startTs);
    const endTs = projectConfig.endTs.toNumber ? projectConfig.endTs.toNumber() : Number(projectConfig.endTs);
    let phase;
    if (now < startTs) {
      phase = 0;
    } else if (now >= startTs && now < endTs) {
      phase = 1;
    } else if (now >= endTs && projectConfig.claimsEnabled) {
      phase = 2;
    } else {
      phase = 3;
    }
    const exchangeRateBps = projectConfig.exchangeRateBasisPoints || 1e4;
    const exchangeRate = BigInt(exchangeRateBps);
    const loadedProject = {
      projectId: projectConfigPda,
      // Use the PDA as the project identifier
      oldTokenMint: projectConfig.oldTokenMint,
      newTokenMint: projectConfig.newTokenMint,
      mftMint: pdas.mftMint,
      phase,
      paused: projectConfig.isPaused || false,
      oldTokenDecimals,
      newTokenDecimals,
      mftDecimals,
      exchangeRate,
      pdas: {
        projectConfig: projectConfigPda,
        mftMint: pdas.mftMint,
        oldTokenVault: pdas.oldTokenVault,
        newTokenVault: pdas.newTokenVault
      }
    };
    sdkCache.set(cacheKey, loadedProject, CACHE_TTL.PROJECT_CONFIG);
    return loadedProject;
  } catch (error) {
    if (error instanceof SdkError) {
      throw error;
    }
    if (error && typeof error === "object" && "message" in error) {
      const message = error.message;
      if (message?.includes("Account does not exist")) {
        throw new SdkError(
          "PROJECT_NOT_FOUND" /* PROJECT_NOT_FOUND */,
          `Project "${projectId}" not found on chain`,
          error
        );
      }
      if (message?.includes("403") || message?.includes("rate limit")) {
        throw new SdkError(
          "RATE_LIMIT" /* RATE_LIMIT */,
          "RPC rate limit reached. Please try again in a moment.",
          error
        );
      }
    }
    throw new SdkError(
      "RPC_ERROR" /* RPC_ERROR */,
      `Failed to load project: ${error instanceof Error ? error.message : "Unknown error"}`,
      error
    );
  }
}
async function getBalances(projectId, user, connection, project, options = {}) {
  const { network, skipCache = false } = options;
  const cacheKey = createCacheKey("balances", projectId, user.toBase58(), network || "default");
  if (!skipCache) {
    const cached = sdkCache.get(cacheKey);
    if (cached) {
      return cached;
    }
  }
  try {
    const loadedProject = project || await loadProject(projectId, connection, { network });
    await rpcThrottle.wait();
    let solBalance = 0n;
    try {
      const balance = await connection.getBalance(user);
      solBalance = BigInt(balance);
    } catch (error) {
      if (error && typeof error === "object" && "message" in error) {
        const message = error.message;
        if (message?.includes("403") || message?.includes("rate limit")) {
          throw new SdkError(
            "RATE_LIMIT" /* RATE_LIMIT */,
            "RPC rate limit reached. Please try again in a moment.",
            error
          );
        }
      }
      solBalance = 0n;
    }
    const oldTokenProgram = TOKEN_PROGRAM_ID;
    await rpcThrottle.wait();
    let oldTokenBalance = 0n;
    try {
      const oldTokenAta = getUserAta(user, loadedProject.oldTokenMint, oldTokenProgram);
      const tokenAccount = await connection.getTokenAccountBalance(oldTokenAta);
      oldTokenBalance = BigInt(tokenAccount.value.amount);
    } catch (error) {
      oldTokenBalance = 0n;
    }
    await rpcThrottle.wait();
    let newTokenBalance = 0n;
    try {
      const newTokenAta = getUserAta(user, loadedProject.newTokenMint, oldTokenProgram);
      const tokenAccount = await connection.getTokenAccountBalance(newTokenAta);
      newTokenBalance = BigInt(tokenAccount.value.amount);
    } catch (error) {
      newTokenBalance = 0n;
    }
    await rpcThrottle.wait();
    let mftBalance = 0n;
    try {
      const mftAta = getUserAta(user, loadedProject.mftMint, TOKEN_PROGRAM_ID);
      const tokenAccount = await connection.getTokenAccountBalance(mftAta);
      mftBalance = BigInt(tokenAccount.value.amount);
    } catch (error) {
      mftBalance = 0n;
    }
    const balanceSnapshot = {
      oldToken: oldTokenBalance,
      newToken: newTokenBalance,
      mft: mftBalance,
      sol: solBalance
    };
    sdkCache.set(cacheKey, balanceSnapshot, CACHE_TTL.BALANCES);
    return balanceSnapshot;
  } catch (error) {
    if (error instanceof SdkError) {
      throw error;
    }
    throw new SdkError(
      "RPC_ERROR" /* RPC_ERROR */,
      `Failed to fetch balances: ${error instanceof Error ? error.message : "Unknown error"}`,
      error
    );
  }
}
function watchBalances(projectId, user, connection, onChange, options = {}) {
  const { intervalMs = 150, network } = options;
  let isActive = true;
  let lastBalances = null;
  let loadedProject;
  const poll = async () => {
    if (!isActive) return;
    try {
      const balances = await getBalances(projectId, user, connection, loadedProject, {
        network,
        skipCache: true
      });
      if (!lastBalances || balances.sol !== lastBalances.sol || balances.oldToken !== lastBalances.oldToken || balances.newToken !== lastBalances.newToken || balances.mft !== lastBalances.mft) {
        lastBalances = balances;
        onChange(balances);
      }
    } catch (error) {
      console.warn("[migrate.fun SDK] Balance watch error:", error);
    }
    if (isActive) {
      setTimeout(poll, intervalMs);
    }
  };
  (async () => {
    try {
      loadedProject = await loadProject(projectId, connection, { network });
    } catch (error) {
      console.warn("[migrate.fun SDK] Failed to load project for balance watch:", error);
    }
    poll();
  })();
  return () => {
    isActive = false;
  };
}
function formatTokenAmount(amount, decimals) {
  const isNegative = amount < 0n;
  const absAmount = isNegative ? -amount : amount;
  const divisor = BigInt(10 ** decimals);
  const wholePart = absAmount / divisor;
  const remainder = absAmount % divisor;
  const decimalPart = remainder.toString().padStart(decimals, "0");
  const trimmedDecimalPart = decimalPart.replace(/0+$/, "");
  if (trimmedDecimalPart === "") {
    return `${isNegative ? "-" : ""}${wholePart}`;
  }
  return `${isNegative ? "-" : ""}${wholePart}.${trimmedDecimalPart}`;
}

// react/useLoadedProject.ts
function useLoadedProject(projectId, connection, options = {}) {
  const {
    network,
    refetchInterval = 0,
    enabled = true
  } = options;
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);
  const intervalRef = useRef(null);
  const fetchProject = useCallback(async () => {
    if (!enabled) {
      return;
    }
    try {
      console.log(`[useLoadedProject] Starting to load project: ${projectId}`);
      setIsLoading(true);
      setError(null);
      const loadedProject = await loadProject(projectId, connection, { network });
      console.log(`[useLoadedProject] Successfully loaded project:`, loadedProject);
      if (isMountedRef.current) {
        setProject(loadedProject);
        setError(null);
      }
    } catch (err) {
      console.error(`[useLoadedProject] Failed to load project "${projectId}":`, err);
      if (isMountedRef.current) {
        const error2 = err instanceof SdkError || err instanceof Error ? err : new Error(String(err));
        setError(error2);
        setProject(null);
      }
    } finally {
      if (isMountedRef.current) {
        console.log(`[useLoadedProject] Finished loading attempt for "${projectId}"`);
        setIsLoading(false);
      }
    }
  }, [projectId, connection, network, enabled]);
  const refetch = useCallback(async () => {
    await fetchProject();
  }, [fetchProject]);
  useEffect(() => {
    fetchProject();
  }, [fetchProject]);
  useEffect(() => {
    if (refetchInterval > 0 && enabled) {
      intervalRef.current = setInterval(() => {
        fetchProject();
      }, refetchInterval);
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
    return void 0;
  }, [refetchInterval, enabled, fetchProject]);
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  return {
    project,
    isLoading,
    error,
    refetch
  };
}
function useBalances(projectId, user, connection, options = {}) {
  const {
    network,
    project,
    refetchInterval = 3e3,
    enabled = true
  } = options;
  const [balances, setBalances] = useState(null);
  const [formatted, setFormatted] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);
  const unsubscribeRef = useRef(null);
  const shouldWatch = refetchInterval > 0;
  const fetchBalances = useCallback(async () => {
    if (!enabled || !user) {
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const snapshot = await getBalances(projectId, user, connection, project, {
        network,
        skipCache: true
      });
      if (isMountedRef.current) {
        setBalances(snapshot);
        if (project) {
          setFormatted({
            oldToken: formatTokenAmount(snapshot.oldToken, project.oldTokenDecimals),
            newToken: formatTokenAmount(snapshot.newToken, project.newTokenDecimals),
            mft: formatTokenAmount(snapshot.mft, project.mftDecimals),
            sol: formatTokenAmount(snapshot.sol, 9)
            // SOL always has 9 decimals
          });
        }
        setError(null);
      }
    } catch (err) {
      if (isMountedRef.current) {
        const error2 = err instanceof SdkError || err instanceof Error ? err : new Error(String(err));
        setError(error2);
        setBalances(null);
        setFormatted(null);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [projectId, user, connection, network, project, enabled]);
  const refetch = useCallback(async () => {
    await fetchBalances();
  }, [fetchBalances]);
  useEffect(() => {
    console.log("[useBalances] Effect triggered", {
      enabled,
      hasUser: !!user,
      shouldWatch,
      hasProject: !!project,
      projectId
    });
    if (!enabled || !user || !shouldWatch) {
      console.log("[useBalances] Hook disabled or waiting for user");
      setIsLoading(false);
      return;
    }
    console.log("[useBalances] Starting balance watch for", user.toBase58());
    setIsLoading(true);
    setError(null);
    const unsubscribe = watchBalances(
      projectId,
      user,
      connection,
      (snapshot) => {
        if (isMountedRef.current) {
          setBalances(snapshot);
          if (project) {
            setFormatted({
              oldToken: formatTokenAmount(snapshot.oldToken, project.oldTokenDecimals),
              newToken: formatTokenAmount(snapshot.newToken, project.newTokenDecimals),
              mft: formatTokenAmount(snapshot.mft, project.mftDecimals),
              sol: formatTokenAmount(snapshot.sol, 9)
            });
          }
          setIsLoading(false);
          setError(null);
        }
      },
      { intervalMs: refetchInterval, network }
    );
    unsubscribeRef.current = unsubscribe;
    return () => {
      console.log("[useBalances] Cleaning up balance watch");
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [projectId, user, connection, network, project, refetchInterval, enabled, shouldWatch]);
  useEffect(() => {
    if (!shouldWatch && enabled && user) {
      fetchBalances();
    }
  }, [shouldWatch, enabled, user, fetchBalances]);
  useEffect(() => {
    if (!balances || !project) return;
    try {
      const next = {
        oldToken: formatTokenAmount(balances.oldToken, project.oldTokenDecimals),
        newToken: formatTokenAmount(balances.newToken, project.newTokenDecimals),
        mft: formatTokenAmount(balances.mft, project.mftDecimals),
        sol: formatTokenAmount(balances.sol, 9)
      };
      setFormatted(next);
    } catch (e) {
    }
  }, [balances, project]);
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);
  return {
    balances,
    formatted,
    isLoading,
    error,
    refetch
  };
}

// src/errors.ts
var PROGRAM_ERROR_CODES = {
  MigrationWindowClosed: 6e3,
  NoMigration: 6006,
  MigrationFailed: 6008,
  InvalidProjectId: 6009,
  ProjectNotInitialized: 6011,
  ProjectPaused: 6015,
  ProjectNotActive: 6017};
var PROGRAM_ERROR_METADATA = {
  [PROGRAM_ERROR_CODES.MigrationWindowClosed]: {
    sdkCode: "MIGRATION_WINDOW_CLOSED" /* MIGRATION_WINDOW_CLOSED */,
    message: "Migration window has closed",
    userMessage: "The migration period for this project has ended. New migrations are no longer accepted.",
    recoveryActions: [
      "Check if there is an extension period",
      "Look for MFT claiming options if you already migrated",
      "Contact the project team for assistance"
    ]
  },
  [PROGRAM_ERROR_CODES.ProjectPaused]: {
    sdkCode: "PROJECT_PAUSED" /* PROJECT_PAUSED */,
    message: "Project is paused",
    userMessage: "This migration project is temporarily paused by the administrator.",
    recoveryActions: [
      "Wait for the project to be unpaused",
      "Check project announcements for updates",
      "Contact the project administrator"
    ]
  },
  [PROGRAM_ERROR_CODES.ProjectNotActive]: {
    sdkCode: "INVALID_PHASE" /* INVALID_PHASE */,
    message: "Project is not in active migration phase",
    userMessage: "This project is not currently accepting migrations.",
    recoveryActions: [
      "Check the project status and phase",
      "Wait for the active migration period to begin",
      "Verify you have the correct project"
    ]
  },
  [PROGRAM_ERROR_CODES.ProjectNotInitialized]: {
    sdkCode: "PROJECT_NOT_FOUND" /* PROJECT_NOT_FOUND */,
    message: "Project not initialized",
    userMessage: "This migration project does not exist or has not been initialized.",
    recoveryActions: [
      "Verify the project ID is correct",
      "Check if the project is on the correct network (devnet/mainnet)",
      "Browse available projects to find the right one"
    ]
  },
  [PROGRAM_ERROR_CODES.InvalidProjectId]: {
    sdkCode: "PROJECT_NOT_FOUND" /* PROJECT_NOT_FOUND */,
    message: "Invalid project ID",
    userMessage: "The project ID format is invalid. It must be lowercase, 16 characters or less, with no spaces.",
    recoveryActions: [
      "Check the project ID format",
      "Ensure all characters are lowercase",
      "Remove any spaces or special characters"
    ]
  },
  [PROGRAM_ERROR_CODES.MigrationFailed]: {
    sdkCode: "TRANSACTION_FAILED" /* TRANSACTION_FAILED */,
    message: "Migration evaluation failed",
    userMessage: "This migration did not meet success criteria. You can claim a refund of your tokens and fees.",
    recoveryActions: [
      "Check the refund claim interface",
      "Your original tokens will be returned",
      "Contact support if you need assistance with the refund"
    ]
  },
  [PROGRAM_ERROR_CODES.NoMigration]: {
    sdkCode: "ACCOUNT_NOT_FOUND" /* ACCOUNT_NOT_FOUND */,
    message: "No migration record found",
    userMessage: "You have not migrated any tokens for this project yet.",
    recoveryActions: [
      "Complete a migration first",
      "Check if you are using the correct wallet",
      "Verify you are on the right network"
    ]
  }
};
function parseError(error) {
  if (error instanceof SdkError) {
    return error;
  }
  const errorObj = error;
  const message = errorObj?.message || errorObj?.toString() || "Unknown error";
  const lowerMessage = message.toLowerCase();
  const programError = parseProgramError(errorObj);
  if (programError) {
    return programError;
  }
  if (lowerMessage.includes("account does not exist") || lowerMessage.includes("accountnotfound")) {
    return new SdkError(
      "ACCOUNT_NOT_FOUND" /* ACCOUNT_NOT_FOUND */,
      "Account not found on-chain",
      error
    );
  }
  if (lowerMessage.includes("insufficient") && lowerMessage.includes("balance")) {
    return new SdkError(
      "INSUFFICIENT_BALANCE" /* INSUFFICIENT_BALANCE */,
      "Insufficient token balance for this operation",
      error
    );
  }
  if (lowerMessage.includes("invalid mint") || lowerMessage.includes("mint mismatch")) {
    return new SdkError(
      "INVALID_MINT" /* INVALID_MINT */,
      "Token mint address does not match expected value",
      error
    );
  }
  if (lowerMessage.includes("simulation failed")) {
    return new SdkError(
      "SIMULATION_FAILED" /* SIMULATION_FAILED */,
      "Transaction simulation failed - the transaction would likely fail on-chain",
      error
    );
  }
  if (lowerMessage.includes("transaction") && lowerMessage.includes("failed")) {
    return new SdkError(
      "TRANSACTION_FAILED" /* TRANSACTION_FAILED */,
      "Transaction failed to execute",
      error
    );
  }
  if (lowerMessage.includes("429") || lowerMessage.includes("rate limit")) {
    return new SdkError(
      "RATE_LIMIT" /* RATE_LIMIT */,
      "RPC rate limit exceeded - please wait and try again",
      error
    );
  }
  if (lowerMessage.includes("rpc") || lowerMessage.includes("network") || lowerMessage.includes("timeout")) {
    return new SdkError(
      "RPC_ERROR" /* RPC_ERROR */,
      "RPC request failed - check your network connection",
      error
    );
  }
  if (lowerMessage.includes("invalid public key") || lowerMessage.includes("invalid address")) {
    return new SdkError(
      "INVALID_PUBLIC_KEY" /* INVALID_PUBLIC_KEY */,
      "Invalid Solana public key format",
      error
    );
  }
  if (lowerMessage.includes("invalid amount") || lowerMessage.includes("amount")) {
    return new SdkError(
      "INVALID_AMOUNT" /* INVALID_AMOUNT */,
      "Invalid token amount",
      error
    );
  }
  return new SdkError(
    "UNKNOWN" /* UNKNOWN */,
    message,
    error
  );
}
function parseProgramError(error) {
  let errorCode;
  if (typeof error?.code === "number") {
    errorCode = error.code;
  }
  if (error?.logs && Array.isArray(error.logs)) {
    for (const log of error.logs) {
      const match = log.match(/Error Code: (\d+)/i);
      if (match) {
        errorCode = parseInt(match[1], 10);
        break;
      }
    }
  }
  const hexMatch = error?.message?.match(/0x([0-9a-f]+)/i);
  if (hexMatch) {
    errorCode = parseInt(hexMatch[1], 16);
  }
  if (!errorCode) {
    return null;
  }
  const metadata = PROGRAM_ERROR_METADATA[errorCode];
  if (metadata) {
    return new SdkError(
      metadata.sdkCode,
      metadata.userMessage,
      error
    );
  }
  return null;
}

// src/builders.ts
async function buildMigrateTx(connection, user, projectId, amount, project, options = {}) {
  try {
    if (project.paused) {
      throw new SdkError(
        "PROJECT_PAUSED" /* PROJECT_PAUSED */,
        "Project is paused - migrations are temporarily disabled"
      );
    }
    if (amount <= 0n) {
      throw new SdkError(
        "INVALID_AMOUNT" /* INVALID_AMOUNT */,
        "Migration amount must be greater than zero"
      );
    }
    const provider = new AnchorProvider(
      connection,
      {
        publicKey: user,
        signTransaction: async () => {
          throw new Error("This is a read-only provider");
        },
        signAllTransactions: async () => {
          throw new Error("This is a read-only provider");
        }
      },
      { commitment: "confirmed" }
    );
    const program = await getProgram(provider);
    const oldTokenProgram = project.oldTokenDecimals === 9 ? TOKEN_PROGRAM_ID : TOKEN_PROGRAM_ID;
    const userOldTokenAta = getAssociatedTokenAddressSync(
      project.oldTokenMint,
      user,
      false,
      oldTokenProgram
    );
    const userMftAta = getAssociatedTokenAddressSync(
      project.mftMint,
      user,
      false,
      TOKEN_PROGRAM_ID
    );
    const accounts = {
      user,
      projectConfig: project.pdas.projectConfig,
      userOldTokenAta,
      userMftAta,
      oldTokenMint: project.oldTokenMint,
      mftMint: project.mftMint,
      // Always pass oldTokenProgram as required by IDL
      oldTokenProgram
    };
    const amountBN = new BN(amount.toString());
    const instruction = await program.methods.migrate(projectId, amountBN).accounts(accounts).instruction();
    const transaction = new Transaction();
    if (options.computeUnitLimit || options.computeUnitPrice) {
    }
    transaction.add(instruction);
    const { blockhash } = await connection.getLatestBlockhash("confirmed");
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = user;
    const expectedMft = calculateMftAmount(amount, project.exchangeRate, project.oldTokenDecimals, project.mftDecimals);
    return {
      transaction,
      amount,
      expectedMft,
      accounts: {
        user,
        projectConfig: project.pdas.projectConfig,
        userOldTokenAta,
        userMftAta,
        oldTokenMint: project.oldTokenMint,
        mftMint: project.mftMint
      }
    };
  } catch (error) {
    throw parseError(error);
  }
}
function calculateMftAmount(oldTokenAmount, exchangeRate, oldTokenDecimals, mftDecimals) {
  const MAX_U64 = BigInt("18446744073709551615");
  if (oldTokenAmount > MAX_U64) {
    throw new SdkError(
      "INVALID_AMOUNT" /* INVALID_AMOUNT */,
      `Amount ${oldTokenAmount} exceeds maximum supported value (u64 limit)`
    );
  }
  const numerator = oldTokenAmount * exchangeRate;
  const denominator = 10000n;
  const quotient = numerator / denominator;
  const remainder = numerator % denominator;
  let mftAmount;
  if (remainder * 2n > denominator) {
    mftAmount = quotient + 1n;
  } else if (remainder * 2n === denominator) {
    mftAmount = quotient % 2n === 0n ? quotient : quotient + 1n;
  } else {
    mftAmount = quotient;
  }
  if (oldTokenDecimals !== mftDecimals) {
    const decimalDiff = mftDecimals - oldTokenDecimals;
    if (decimalDiff > 0) {
      const result = mftAmount * BigInt(10 ** decimalDiff);
      if (result > MAX_U64) {
        throw new SdkError(
          "INVALID_AMOUNT" /* INVALID_AMOUNT */,
          "Calculated MFT amount exceeds maximum supported value (u64 limit)"
        );
      }
      return result;
    } else {
      return mftAmount / BigInt(10 ** Math.abs(decimalDiff));
    }
  }
  return mftAmount;
}
async function sendAndConfirmTransaction(connection, transaction, options = {}) {
  try {
    const rawTransaction = transaction.serialize();
    const signature = await connection.sendRawTransaction(rawTransaction, {
      skipPreflight: options.skipPreflight ?? false,
      preflightCommitment: "confirmed"
    });
    const confirmation = await connection.confirmTransaction(signature, "confirmed");
    if (confirmation.value.err) {
      throw new SdkError(
        "TRANSACTION_FAILED" /* TRANSACTION_FAILED */,
        `Transaction failed: ${JSON.stringify(confirmation.value.err)}`,
        confirmation.value.err
      );
    }
    return signature;
  } catch (error) {
    throw parseError(error);
  }
}

// react/useMigrate.ts
function useMigrate(connection, wallet, options = {}) {
  const { onSuccess, onError, onStatusChange } = options;
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [signature, setSignature] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isMountedRef = useRef(true);
  const updateStatus = useCallback(
    (newStatus) => {
      if (isMountedRef.current) {
        setStatus(newStatus);
        if (onStatusChange) {
          onStatusChange(newStatus);
        }
      }
    },
    [onStatusChange]
  );
  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
    setSignature(null);
    setIsLoading(false);
  }, []);
  const migrate = useCallback(
    async (projectId, amount, project) => {
      if (!wallet.publicKey) {
        const error2 = new Error("Wallet not connected");
        setError(error2);
        if (onError) {
          onError(error2);
        }
        throw error2;
      }
      if (!wallet.signTransaction) {
        const error2 = new Error("Wallet does not support signing transactions");
        setError(error2);
        if (onError) {
          onError(error2);
        }
        throw error2;
      }
      try {
        setIsLoading(true);
        setError(null);
        setSignature(null);
        updateStatus("preparing");
        const { transaction } = await buildMigrateTx(
          connection,
          wallet.publicKey,
          projectId,
          amount,
          project
        );
        updateStatus("signing");
        const signedTransaction = await wallet.signTransaction(transaction);
        updateStatus("sending");
        const sig = await sendAndConfirmTransaction(connection, signedTransaction);
        updateStatus("confirming");
        updateStatus("confirmed");
        if (isMountedRef.current) {
          setSignature(sig);
          setIsLoading(false);
        }
        if (onSuccess) {
          onSuccess(sig);
        }
        setTimeout(() => {
          if (isMountedRef.current) {
            updateStatus("idle");
          }
        }, 2e3);
        return sig;
      } catch (err) {
        const error2 = err instanceof SdkError || err instanceof Error ? err : new Error(String(err));
        if (isMountedRef.current) {
          setError(error2);
          setIsLoading(false);
          updateStatus("error");
        }
        if (onError) {
          onError(error2);
        }
        throw error2;
      }
    },
    [connection, wallet, onSuccess, onError, updateStatus]
  );
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  return {
    migrate,
    isLoading,
    status,
    error,
    signature,
    reset
  };
}

export { useBalances, useLoadedProject, useMigrate };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map