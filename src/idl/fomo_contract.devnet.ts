/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/fomo_contract.json`.
 */
export type FomoContract = {
  address: "DqVmwHf8tAWXEQQozm22PRiLcY6ntzJwaMYSCZdTxotC";
  metadata: {
    name: "fomoContract";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "buy";
      discriminator: [102, 6, 61, 18, 1, 218, 235, 234];
      accounts: [
        {
          name: "payer";
          writable: true;
          signer: true;
        },
        {
          name: "bondingCurve";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  98,
                  111,
                  110,
                  100,
                  105,
                  110,
                  103,
                  45,
                  99,
                  117,
                  114,
                  118,
                  101
                ];
              },
              {
                kind: "account";
                path: "mint";
              }
            ];
          };
        },
        {
          name: "creatorData";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [99, 114, 101, 97, 116, 111, 114];
              },
              {
                kind: "account";
                path: "bonding_curve.creator";
                account: "bondingCurve";
              },
              {
                kind: "account";
                path: "bonding_curve.mint";
                account: "bondingCurve";
              }
            ];
          };
        },
        {
          name: "userAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "payer";
              },
              {
                kind: "const";
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
                ];
              },
              {
                kind: "account";
                path: "mint";
              }
            ];
            program: {
              kind: "const";
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
              ];
            };
          };
        },
        {
          name: "mint";
        },
        {
          name: "bondingAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "bondingCurve";
              },
              {
                kind: "const";
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
                ];
              },
              {
                kind: "account";
                path: "mint";
              }
            ];
            program: {
              kind: "const";
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
              ];
            };
          };
        },
        {
          name: "global";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [103, 108, 111, 98, 97, 108];
              }
            ];
          };
        },
        {
          name: "feeWallet";
          writable: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "tokenProgram";
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        },
        {
          name: "associatedTokenProgram";
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        },
        {
          name: "maxSolOut";
          type: "u64";
        }
      ];
    },
    {
      name: "create";
      discriminator: [24, 30, 200, 40, 5, 28, 7, 119];
      accounts: [
        {
          name: "payer";
          writable: true;
          signer: true;
        },
        {
          name: "mint";
          writable: true;
        },
        {
          name: "bondingCurve";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  98,
                  111,
                  110,
                  100,
                  105,
                  110,
                  103,
                  45,
                  99,
                  117,
                  114,
                  118,
                  101
                ];
              },
              {
                kind: "account";
                path: "mint";
              }
            ];
          };
        },
        {
          name: "bondingAta";
          writable: true;
        },
        {
          name: "global";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [103, 108, 111, 98, 97, 108];
              }
            ];
          };
        },
        {
          name: "metadata";
          writable: true;
        },
        {
          name: "treasury";
        },
        {
          name: "treasuryAta";
          writable: true;
        },
        {
          name: "creatorData";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [99, 114, 101, 97, 116, 111, 114];
              },
              {
                kind: "account";
                path: "payer";
              },
              {
                kind: "account";
                path: "mint";
              }
            ];
          };
        },
        {
          name: "masterEdition";
          writable: true;
        },
        {
          name: "createSolFeeDest";
          writable: true;
        },
        {
          name: "tokenProgram";
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "mplTokenMetadata";
          docs: ["CHECK"];
          address: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";
        },
        {
          name: "sysvarInstructions";
        },
        {
          name: "associatedTokenProgram";
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        }
      ];
      args: [
        {
          name: "name";
          type: "string";
        },
        {
          name: "symbol";
          type: "string";
        },
        {
          name: "uri";
          type: "string";
        },
        {
          name: "requiredLiquidity";
          type: "u64";
        }
      ];
    },
    {
      name: "editGlobal";
      discriminator: [37, 79, 163, 162, 182, 86, 142, 159];
      accounts: [
        {
          name: "authority";
          signer: true;
        },
        {
          name: "global";
          writable: true;
        }
      ];
      args: [
        {
          name: "authority";
          type: {
            option: "pubkey";
          };
        },
        {
          name: "feeWallet";
          type: {
            option: "pubkey";
          };
        },
        {
          name: "treasuryWallet";
          type: {
            option: "pubkey";
          };
        },
        {
          name: "feeBps";
          type: {
            option: "u16";
          };
        },
        {
          name: "rewardConfig";
          type: {
            option: {
              vec: {
                defined: {
                  name: "rewardConfig";
                };
              };
            };
          };
        },
        {
          name: "rewardHoldUp";
          type: {
            option: "i64";
          };
        }
      ];
    },
    {
      name: "initGlobalData";
      discriminator: [165, 42, 53, 210, 118, 33, 211, 76];
      accounts: [
        {
          name: "payer";
          writable: true;
          signer: true;
        },
        {
          name: "globalData";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [103, 108, 111, 98, 97, 108];
              }
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "authority";
          type: "pubkey";
        },
        {
          name: "feeWallet";
          type: "pubkey";
        },
        {
          name: "treasuryWallet";
          type: "pubkey";
        },
        {
          name: "feeBps";
          type: "u16";
        },
        {
          name: "rewardHoldUp";
          type: "i64";
        },
        {
          name: "rewardConfig";
          type: {
            vec: {
              defined: {
                name: "rewardConfig";
              };
            };
          };
        },
        {
          name: "devWallet";
          type: "pubkey";
        },
        {
          name: "burnMint";
          type: "pubkey";
        },
        {
          name: "burnAmount";
          type: "u64";
        },
        {
          name: "createSolDestination";
          type: "pubkey";
        },
        {
          name: "createSolFee";
          type: "u64";
        }
      ];
    },
    {
      name: "sell";
      discriminator: [51, 230, 133, 164, 1, 127, 131, 173];
      accounts: [
        {
          name: "payer";
          writable: true;
          signer: true;
        },
        {
          name: "bondingCurve";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  98,
                  111,
                  110,
                  100,
                  105,
                  110,
                  103,
                  45,
                  99,
                  117,
                  114,
                  118,
                  101
                ];
              },
              {
                kind: "account";
                path: "mint";
              }
            ];
          };
        },
        {
          name: "creatorData";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [99, 114, 101, 97, 116, 111, 114];
              },
              {
                kind: "account";
                path: "bonding_curve.creator";
                account: "bondingCurve";
              },
              {
                kind: "account";
                path: "bonding_curve.mint";
                account: "bondingCurve";
              }
            ];
          };
        },
        {
          name: "userAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "payer";
              },
              {
                kind: "const";
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
                ];
              },
              {
                kind: "account";
                path: "mint";
              }
            ];
            program: {
              kind: "const";
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
              ];
            };
          };
        },
        {
          name: "mint";
        },
        {
          name: "bondingAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "bondingCurve";
              },
              {
                kind: "const";
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
                ];
              },
              {
                kind: "account";
                path: "mint";
              }
            ];
            program: {
              kind: "const";
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
              ];
            };
          };
        },
        {
          name: "global";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [103, 108, 111, 98, 97, 108];
              }
            ];
          };
        },
        {
          name: "feeWallet";
          writable: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "tokenProgram";
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        },
        {
          name: "associatedTokenProgram";
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        },
        {
          name: "minSolOut";
          type: "u64";
        }
      ];
    },
    {
      name: "withdraw";
      discriminator: [183, 18, 70, 156, 148, 109, 161, 34];
      accounts: [
        {
          name: "authority";
          writable: true;
          signer: true;
        },
        {
          name: "global";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [103, 108, 111, 98, 97, 108];
              }
            ];
          };
        },
        {
          name: "bondingCurve";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  98,
                  111,
                  110,
                  100,
                  105,
                  110,
                  103,
                  45,
                  99,
                  117,
                  114,
                  118,
                  101
                ];
              },
              {
                kind: "account";
                path: "mint";
              }
            ];
          };
        },
        {
          name: "mint";
        },
        {
          name: "bondingAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "bondingCurve";
              },
              {
                kind: "const";
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
                ];
              },
              {
                kind: "account";
                path: "mint";
              }
            ];
            program: {
              kind: "const";
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
              ];
            };
          };
        },
        {
          name: "authAta";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "authority";
              },
              {
                kind: "const";
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
                ];
              },
              {
                kind: "account";
                path: "mint";
              }
            ];
            program: {
              kind: "const";
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
              ];
            };
          };
        },
        {
          name: "tokenProgram";
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "associatedTokenProgram";
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: "bondingCurve";
      discriminator: [23, 183, 248, 55, 96, 216, 172, 96];
    },
    {
      name: "creatorData";
      discriminator: [205, 109, 39, 22, 34, 249, 243, 16];
    },
    {
      name: "globalData";
      discriminator: [48, 194, 194, 186, 46, 71, 131, 61];
    }
  ];
  events: [
    {
      name: "fundsWithdrawn";
      discriminator: [56, 130, 230, 154, 35, 92, 11, 118];
    },
    {
      name: "tokenBonded";
      discriminator: [55, 198, 46, 198, 114, 67, 37, 235];
    },
    {
      name: "tokenCreated";
      discriminator: [236, 19, 41, 255, 130, 78, 147, 172];
    },
    {
      name: "tokenPurchase";
      discriminator: [187, 33, 16, 118, 195, 28, 182, 248];
    },
    {
      name: "tokenSale";
      discriminator: [49, 172, 162, 47, 89, 241, 207, 41];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "notEnoughTokensOnBondingCurve";
      msg: "Not enough tokens on bonding curve!";
    },
    {
      code: 6001;
      name: "invalidTradeAmount";
      msg: "Invalid trade amount!";
    },
    {
      code: 6002;
      name: "tokenAlreadyBonded";
      msg: "Token already bonded!";
    },
    {
      code: 6003;
      name: "invalidPlatformAuthority";
      msg: "Invalid platform authority!";
    },
    {
      code: 6004;
      name: "invalidRewardConfig";
      msg: "Invalid reward config. Too many configurations!";
    },
    {
      code: 6005;
      name: "invalidMint";
      msg: "Invalid bonding curve mint!";
    },
    {
      code: 6006;
      name: "invalidFeeWallet";
      msg: "Invalid fee wallet";
    },
    {
      code: 6007;
      name: "slippageExceeded";
      msg: "Slippage exceeded";
    },
    {
      code: 6008;
      name: "tokenNotBonded";
      msg: "Token not bonded";
    }
  ];
  types: [
    {
      name: "bondingCurve";
      type: {
        kind: "struct";
        fields: [
          {
            name: "mint";
            type: "pubkey";
          },
          {
            name: "virtualTokenReserve";
            type: "u64";
          },
          {
            name: "virtualSolReserve";
            type: "u64";
          },
          {
            name: "realSolReserve";
            type: "u64";
          },
          {
            name: "realTokenReserve";
            type: "u64";
          },
          {
            name: "completed";
            type: "bool";
          },
          {
            name: "bump";
            type: "u8";
          },
          {
            name: "createdAt";
            type: "i64";
          },
          {
            name: "creator";
            type: "pubkey";
          }
        ];
      };
    },
    {
      name: "creatorData";
      type: {
        kind: "struct";
        fields: [
          {
            name: "creator";
            type: "pubkey";
          },
          {
            name: "mint";
            type: "pubkey";
          },
          {
            name: "accumulatedFees";
            type: "u64";
          },
          {
            name: "createdAt";
            type: "i64";
          }
        ];
      };
    },
    {
      name: "fundsWithdrawn";
      type: {
        kind: "struct";
        fields: [
          {
            name: "token";
            type: "pubkey";
          },
          {
            name: "solAmount";
            type: "u64";
          },
          {
            name: "tokenAmount";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "globalData";
      type: {
        kind: "struct";
        fields: [
          {
            name: "authority";
            type: "pubkey";
          },
          {
            name: "treasuryWallet";
            type: "pubkey";
          },
          {
            name: "feeWallet";
            type: "pubkey";
          },
          {
            name: "feeBps";
            type: "u16";
          },
          {
            name: "rewardHoldUp";
            type: "i64";
          },
          {
            name: "rewardConfig";
            type: {
              vec: {
                defined: {
                  name: "rewardConfig";
                };
              };
            };
          },
          {
            name: "devWallet";
            type: "pubkey";
          },
          {
            name: "burnMint";
            type: "pubkey";
          },
          {
            name: "burnAmount";
            type: "u64";
          },
          {
            name: "createSolDestination";
            type: "pubkey";
          },
          {
            name: "createSolFee";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "rewardConfig";
      type: {
        kind: "struct";
        fields: [
          {
            name: "usdVolume";
            type: "u64";
          },
          {
            name: "percentageBps";
            type: "u16";
          }
        ];
      };
    },
    {
      name: "tokenBonded";
      type: {
        kind: "struct";
        fields: [
          {
            name: "token";
            type: "pubkey";
          },
          {
            name: "bondingCurve";
            type: "pubkey";
          },
          {
            name: "accumulatedSol";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "tokenCreated";
      type: {
        kind: "struct";
        fields: [
          {
            name: "name";
            type: "string";
          },
          {
            name: "symbol";
            type: "string";
          },
          {
            name: "mint";
            type: "pubkey";
          },
          {
            name: "creator";
            type: "pubkey";
          },
          {
            name: "requiredLiquidity";
            type: "u64";
          },
          {
            name: "createdAt";
            type: "i64";
          }
        ];
      };
    },
    {
      name: "tokenPurchase";
      type: {
        kind: "struct";
        fields: [
          {
            name: "token";
            type: "pubkey";
          },
          {
            name: "virtualTokenReserve";
            type: "u64";
          },
          {
            name: "realTokenReserve";
            type: "u64";
          },
          {
            name: "virtualSolReserve";
            type: "u64";
          },
          {
            name: "realSolReserve";
            type: "u64";
          },
          {
            name: "isCompleted";
            type: "bool";
          },
          {
            name: "bondingCurve";
            type: "pubkey";
          },
          {
            name: "buyer";
            type: "pubkey";
          },
          {
            name: "boughtAmount";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "tokenSale";
      type: {
        kind: "struct";
        fields: [
          {
            name: "token";
            type: "pubkey";
          },
          {
            name: "virtualTokenReserve";
            type: "u64";
          },
          {
            name: "realTokenReserve";
            type: "u64";
          },
          {
            name: "virtualSolReserve";
            type: "u64";
          },
          {
            name: "realSolReserve";
            type: "u64";
          },
          {
            name: "isCompleted";
            type: "bool";
          },
          {
            name: "bondingCurve";
            type: "pubkey";
          },
          {
            name: "seller";
            type: "pubkey";
          },
          {
            name: "soldAmount";
            type: "u64";
          }
        ];
      };
    }
  ];
};
