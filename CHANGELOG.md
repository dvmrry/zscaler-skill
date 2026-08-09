# Changelog

All notable changes to this skill are recorded here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); this project versions
the skill as a whole, not any single script.

## [0.16.4](https://github.com/dvmrry/zscaler-skill/compare/v0.16.3...v0.16.4) (2026-08-09)


### Documentation

* reconcile Terraformer 2.1.21 and activation behavior ([#255](https://github.com/dvmrry/zscaler-skill/issues/255)) ([4c7325a](https://github.com/dvmrry/zscaler-skill/commit/4c7325a89e6708e52d669b573f5f9f4d4dde7268))
* reconcile Terraformer and activation updates ([4c7325a](https://github.com/dvmrry/zscaler-skill/commit/4c7325a89e6708e52d669b573f5f9f4d4dde7268))
* refresh MCP references for v0.15 ([#253](https://github.com/dvmrry/zscaler-skill/issues/253)) ([3696313](https://github.com/dvmrry/zscaler-skill/commit/36963130209d08ee04bc487041b2c8e7005039dd))
* refresh SDK knowledge for Go 3.8.45 and Python 1.9.41 ([#254](https://github.com/dvmrry/zscaler-skill/issues/254)) ([aa01da9](https://github.com/dvmrry/zscaler-skill/commit/aa01da9d5bb79b020a7b5da39a1ab465bbf5248e))
* refresh vendor knowledge and OneAPI coverage ([#249](https://github.com/dvmrry/zscaler-skill/issues/249)) ([dd3f2f7](https://github.com/dvmrry/zscaler-skill/commit/dd3f2f75286d09b6fc6fc6eb93ec7071733b3a90))

## [0.16.3](https://github.com/dvmrry/zscaler-skill/compare/v0.16.2...v0.16.3) (2026-07-31)


### Bug Fixes

* **ci:** serialize releases and gate risky vendor bumps ([#245](https://github.com/dvmrry/zscaler-skill/issues/245)) ([b195e82](https://github.com/dvmrry/zscaler-skill/commit/b195e82b1883bb105b2e15b56600ec799a1e8f2f))

## [0.16.2](https://github.com/dvmrry/zscaler-skill/compare/v0.16.1...v0.16.2) (2026-07-31)


### Documentation

* refresh Go SDK 3.8.43 and ZPA provider 4.4.10 ([#242](https://github.com/dvmrry/zscaler-skill/issues/242)) ([64ae32a](https://github.com/dvmrry/zscaler-skill/commit/64ae32a915b83d6c0026dd825f5c7cdd7e8e6075))

## [0.16.1](https://github.com/dvmrry/zscaler-skill/compare/v0.16.0...v0.16.1) (2026-07-30)


### Documentation

* refresh MCP 0.14 and SDK 1.9.39 coverage ([#240](https://github.com/dvmrry/zscaler-skill/pull/240))

## [0.16.0](https://github.com/dvmrry/zscaler-skill/compare/v0.15.0...v0.16.0) (2026-07-26)


### Features

* optional operational-knowledge overlay contract ([#237](https://github.com/dvmrry/zscaler-skill/issues/237)) ([ccfff8d](https://github.com/dvmrry/zscaler-skill/commit/ccfff8da30e14346b7bd09851581c6d4c0d7b96e))
* enforce Node.js 20.11+ and add a unified full gate ([#235](https://github.com/dvmrry/zscaler-skill/pull/235)) ([3eeacb7](https://github.com/dvmrry/zscaler-skill/commit/3eeacb75863a9a7d6d2727e1707ff8682e2ebb39))
* enforce `zscalerctl` as the tenant-observation boundary ([#236](https://github.com/dvmrry/zscaler-skill/pull/236)) ([60215e8](https://github.com/dvmrry/zscaler-skill/commit/60215e8d6349d831a364c7954778100de6437e07))


### Documentation

* refresh vendor KB for MCP 0.13.4 ([#232](https://github.com/dvmrry/zscaler-skill/issues/232)) ([04e3a39](https://github.com/dvmrry/zscaler-skill/commit/04e3a3920abac2d5dca4c2bb51970ba811c465d4))

## [0.15.0](https://github.com/dvmrry/zscaler-skill/compare/v0.14.0...v0.15.0) (2026-07-22)


### Features

* refresh vendor contracts and ZPA guidance ([#225](https://github.com/dvmrry/zscaler-skill/issues/225)) ([2fe96eb](https://github.com/dvmrry/zscaler-skill/commit/2fe96eb2dd329a08e7b839e23493a36e34c32ebb))


### Documentation

* incorporate July 2026 vendor changes ([#229](https://github.com/dvmrry/zscaler-skill/issues/229)) ([66e8aaa](https://github.com/dvmrry/zscaler-skill/commit/66e8aaa68851205e89dae799e65a66868c0a2f00))

## [0.14.0](https://github.com/dvmrry/zscaler-skill/compare/v0.13.22...v0.14.0) (2026-07-17)

### Features

- **auditor:** add adversarial diff and release-readiness review ([#215](https://github.com/dvmrry/zscaler-skill/pull/215)) ([a767ee3](https://github.com/dvmrry/zscaler-skill/commit/a767ee30fc21ecda294312c52714e01eaba0da03))
- **runtime-data:** make overlays downstream-configurable ([#216](https://github.com/dvmrry/zscaler-skill/pull/216)) ([acbaf1d](https://github.com/dvmrry/zscaler-skill/commit/acbaf1d55939f71d71e755accddac57ee95de4c3))
- **mcp:** integrate v0.13.1 source layout and coverage changes ([#221](https://github.com/dvmrry/zscaler-skill/pull/221)) ([69c14d4](https://github.com/dvmrry/zscaler-skill/commit/69c14d48f522a5791e03c5b14ec88cab461a6865))

### Bug Fixes

- **researcher:** harden vendor refresh and verification gates ([#219](https://github.com/dvmrry/zscaler-skill/pull/219)) ([a93f971](https://github.com/dvmrry/zscaler-skill/commit/a93f97189b176a45e4c0a877b353a7ccf2ebda91))
- **mcp:** reconcile Pydantic input models against vendor source ([#220](https://github.com/dvmrry/zscaler-skill/pull/220)) ([7f9e0a9](https://github.com/dvmrry/zscaler-skill/commit/7f9e0a9b742bf49d0613207cb3b435dee1a9da61))

### Documentation

- **ai-guard:** add endpoint issue context ([#212](https://github.com/dvmrry/zscaler-skill/pull/212)) ([bca135e](https://github.com/dvmrry/zscaler-skill/commit/bca135e45c3df8bae5a45b3d93eaf11634e48182))

### Maintenance

- **deps:** update pinned Zscaler upstream submodules ([#213](https://github.com/dvmrry/zscaler-skill/pull/213)) ([40f681d](https://github.com/dvmrry/zscaler-skill/commit/40f681d1e1bc57d97b9c69eb584b9c2230e5a215))
- **ci:** bump `astral-sh/setup-uv` from 8.3.0 to 8.3.2 ([#217](https://github.com/dvmrry/zscaler-skill/pull/217)) ([6cce7e3](https://github.com/dvmrry/zscaler-skill/commit/6cce7e3bbaf5e5150bcf232423dfc52cb3f6698f))
- **release:** restore automatic release PR preparation and compare-range review ([#222](https://github.com/dvmrry/zscaler-skill/pull/222)) ([d452076](https://github.com/dvmrry/zscaler-skill/commit/d4520769933ed1f3024b03aa72f9c59bb54dfa05))

## [0.13.22](https://github.com/dvmrry/zscaler-skill/compare/v0.13.21...v0.13.22) (2026-07-09)

### Bug Fixes

- Make `VERSION` the release tag source and fail CI when release metadata disagrees.

### Documentation

- Complete portable runtime discovery and refresh stale onboarding and project-state guidance.

## [0.13.21](https://github.com/dvmrry/zscaler-skill/compare/v0.13.5...v0.13.21) (2026-07-09)

### Features

- Add deterministic setup checks, capability routing, MCP conformance gates, and richer workflow artifact status.

### Documentation

- Refresh Tier 1 and Tier 2 reference coverage, generated OneAPI contracts, runtime-data mounting, and weekly upstream maintenance guidance.

### Maintenance

- Update pinned upstream SDK, provider, module, and contract sources through `v0.13.21`.

## [0.13.5](https://github.com/dvmrry/zscaler-skill/compare/v0.13.4...v0.13.5) (2026-06-16)


### Documentation

* **tier-c:** refresh insights analytics stubs ([#150](https://github.com/dvmrry/zscaler-skill/issues/150)) ([a76e898](https://github.com/dvmrry/zscaler-skill/commit/a76e898d1345515048c51a58bde687d49268d6f4))
* **tier-c:** refresh risk family stubs ([#151](https://github.com/dvmrry/zscaler-skill/issues/151)) ([db87aee](https://github.com/dvmrry/zscaler-skill/commit/db87aeececc5e212da2d5c5d8980d43ea83fc5ce))

## [0.13.4](https://github.com/dvmrry/zscaler-skill/compare/v0.13.3...v0.13.4) (2026-06-16)


### Documentation

* **zbi:** add missed ansible isolation coverage ([#149](https://github.com/dvmrry/zscaler-skill/issues/149)) ([4b7cf64](https://github.com/dvmrry/zscaler-skill/commit/4b7cf64c51721818468b92528ce50661bfb58a1e))
* **zwa:** refresh workflow automation references ([#148](https://github.com/dvmrry/zscaler-skill/issues/148)) ([fa88fa4](https://github.com/dvmrry/zscaler-skill/commit/fa88fa4a99c4cb8977e14777353e3362ad8862bb))

## [0.13.3](https://github.com/dvmrry/zscaler-skill/compare/v0.13.2...v0.13.3) (2026-06-16)


### Documentation

* **zbi:** refresh browser isolation references ([#146](https://github.com/dvmrry/zscaler-skill/issues/146)) ([0d53eeb](https://github.com/dvmrry/zscaler-skill/commit/0d53eeb2b8351ab9b0983ce2d64c4e3a4daf13e1))

## [0.13.2](https://github.com/dvmrry/zscaler-skill/compare/v0.13.1...v0.13.2) (2026-06-16)


### Documentation

* **ai-security:** add Tier 2 API divergence ledger ([#143](https://github.com/dvmrry/zscaler-skill/issues/143)) ([27b04f2](https://github.com/dvmrry/zscaler-skill/commit/27b04f2d2d734852215e9c2e64ab6bc7a17b6cc4))

## [0.13.1](https://github.com/dvmrry/zscaler-skill/compare/v0.13.0...v0.13.1) (2026-06-16)


### Documentation

* **shared:** tighten Tier 2 citation ledger ([#142](https://github.com/dvmrry/zscaler-skill/issues/142)) ([8ba348d](https://github.com/dvmrry/zscaler-skill/commit/8ba348d391b7a5223b3be7c8fecdfe94cf7e2982))

## [0.13.0](https://github.com/dvmrry/zscaler-skill/compare/v0.12.8...v0.13.0) (2026-06-16)


### Features

* **router:** register setup capability + under-specified routing clause ([#121](https://github.com/dvmrry/zscaler-skill/issues/121)) ([f7c3e52](https://github.com/dvmrry/zscaler-skill/commit/f7c3e524a3c08faf4d4022914817767e63046287))

## [0.12.8](https://github.com/dvmrry/zscaler-skill/compare/v0.12.7...v0.12.8) (2026-06-16)


### Documentation

* **zia:** refresh + enhance against current vendor source (DAV-19) ([#127](https://github.com/dvmrry/zscaler-skill/issues/127)) ([7ceee70](https://github.com/dvmrry/zscaler-skill/commit/7ceee701f6b91268fcd5dfba44117ab3bec2d98e))

## [0.12.7](https://github.com/dvmrry/zscaler-skill/compare/v0.12.6...v0.12.7) (2026-06-16)


### Documentation

* **zpa:** refresh + enhance against current vendor source (DAV-19) ([#128](https://github.com/dvmrry/zscaler-skill/issues/128)) ([e496da9](https://github.com/dvmrry/zscaler-skill/commit/e496da9c54c88337a5fb4fe9210dd932d11dad9b))

## [0.12.6](https://github.com/dvmrry/zscaler-skill/compare/v0.12.5...v0.12.6) (2026-06-16)


### Documentation

* **cloud-connector:** refresh + enhance against current vendor source (DAV-19) ([#130](https://github.com/dvmrry/zscaler-skill/issues/130)) ([16e737e](https://github.com/dvmrry/zscaler-skill/commit/16e737e1397fbf31bc055f6f77065971b17d76be))

## [0.12.5](https://github.com/dvmrry/zscaler-skill/compare/v0.12.4...v0.12.5) (2026-06-16)


### Documentation

* **zcc:** refresh + enhance against current vendor source (DAV-19) ([#129](https://github.com/dvmrry/zscaler-skill/issues/129)) ([7c489b9](https://github.com/dvmrry/zscaler-skill/commit/7c489b929d5b45f27174e4dabcff3d7f028b3c89))

## [0.12.4](https://github.com/dvmrry/zscaler-skill/compare/v0.12.3...v0.12.4) (2026-06-16)


### Documentation

* **zdx:** refresh + enhance against current vendor source (DAV-19) ([#132](https://github.com/dvmrry/zscaler-skill/issues/132)) ([ec846cc](https://github.com/dvmrry/zscaler-skill/commit/ec846cceef400b3909c16080086002d84a57fc5b))

## [0.12.3](https://github.com/dvmrry/zscaler-skill/compare/v0.12.2...v0.12.3) (2026-06-16)


### Documentation

* **zidentity:** refresh + enhance against current vendor source (DAV-19) ([#126](https://github.com/dvmrry/zscaler-skill/issues/126)) ([1f3fb18](https://github.com/dvmrry/zscaler-skill/commit/1f3fb187769eb13a92460b773574aee554cbbb07))

## [0.12.2](https://github.com/dvmrry/zscaler-skill/compare/v0.12.1...v0.12.2) (2026-06-16)


### Bug Fixes

* **hygiene:** unquoted-source-path lint no longer flags backticked nested /scripts/ paths ([#133](https://github.com/dvmrry/zscaler-skill/issues/133)) ([ef23dfb](https://github.com/dvmrry/zscaler-skill/commit/ef23dfbef1baa91e157de21a8ce58b43d7d90892))

## [0.12.1](https://github.com/dvmrry/zscaler-skill/compare/v0.12.0...v0.12.1) (2026-06-15)


### Documentation

* **references:** independent vendor-MCP scrape (EASM, ZMS API, ZIA, ZDX, ZCC, ZPA) ([#123](https://github.com/dvmrry/zscaler-skill/issues/123)) ([3aad598](https://github.com/dvmrry/zscaler-skill/commit/3aad598ad676ebbcc73569bf976d0f1e2c4d61d9))

## [0.12.0](https://github.com/dvmrry/zscaler-skill/compare/v0.11.1...v0.12.0) (2026-06-14)


### Features

* **router:** [@zscaler](https://github.com/zscaler) intent-router — capability registry (Increment 1) ([#119](https://github.com/dvmrry/zscaler-skill/issues/119)) ([6494555](https://github.com/dvmrry/zscaler-skill/commit/649455550696532c82192a291e06ce998d2c3eca))

## [0.11.1](https://github.com/dvmrry/zscaler-skill/compare/v0.11.0...v0.11.1) (2026-06-14)


### Bug Fixes

* **bridge:** retry signal uses per-run finding delta, not cumulative disk ([#117](https://github.com/dvmrry/zscaler-skill/issues/117)) ([48f76f4](https://github.com/dvmrry/zscaler-skill/commit/48f76f415720a16c21c07775b77c54a031802a44))

## [0.11.0](https://github.com/dvmrry/zscaler-skill/compare/v0.10.1...v0.11.0) (2026-06-14)


### Features

* **bridge:** meta-retro MVP — inline run-quality digest ([#115](https://github.com/dvmrry/zscaler-skill/issues/115)) ([ed8dac4](https://github.com/dvmrry/zscaler-skill/commit/ed8dac474e34e61e3cd748ec6bdb6aad526a7b5f))

## [0.10.1](https://github.com/dvmrry/zscaler-skill/compare/v0.10.0...v0.10.1) (2026-06-14)


### Bug Fixes

* **data-contract:** formalize _data/audits and _data/soc-reviews ([#113](https://github.com/dvmrry/zscaler-skill/issues/113)) ([b2e5ed9](https://github.com/dvmrry/zscaler-skill/commit/b2e5ed914261a726224883d280897e43c2a33e3d))

## [0.10.0](https://github.com/dvmrry/zscaler-skill/compare/v0.9.2...v0.10.0) (2026-06-14)


### Features

* **bridge:** PR4 tool-order observability — expectedToolSequence + gate the bridge suite ([#111](https://github.com/dvmrry/zscaler-skill/issues/111)) ([2a5e4e5](https://github.com/dvmrry/zscaler-skill/commit/2a5e4e50c439316460b9a7749a21e397de93e52e))

## [0.9.2](https://github.com/dvmrry/zscaler-skill/compare/v0.9.1...v0.9.2) (2026-06-14)


### Bug Fixes

* **artifacts:** safeRepoPath no longer rejects paths that merely start with ".." ([#109](https://github.com/dvmrry/zscaler-skill/issues/109)) ([f0a945f](https://github.com/dvmrry/zscaler-skill/commit/f0a945f8257c7ec9c95343421ac0ef4efe1f40af))

## [0.9.1](https://github.com/dvmrry/zscaler-skill/compare/v0.9.0...v0.9.1) (2026-06-12)


### Documentation

* **zpa:** de-attribute IaC field observations to protect private infra ([#105](https://github.com/dvmrry/zscaler-skill/issues/105)) ([4daa898](https://github.com/dvmrry/zscaler-skill/commit/4daa89819405c573e093ab966f1cd0554bb37b39))

## [0.9.0](https://github.com/dvmrry/zscaler-skill/compare/v0.8.0...v0.9.0) (2026-06-12)


### Features

* **auditor:** second role on the proven foundation — evidence-gated findings, conformant MCP server ([#102](https://github.com/dvmrry/zscaler-skill/issues/102)) ([3ee9143](https://github.com/dvmrry/zscaler-skill/commit/3ee9143eead0b6427dbcd1f8fb516c2313090293))
* **soc:** third role on the proven foundation — security posture review with framework-not-evidence gate ([#104](https://github.com/dvmrry/zscaler-skill/issues/104)) ([ac38629](https://github.com/dvmrry/zscaler-skill/commit/ac38629e0dc71a070e31f74b76f132b6bc3bb731))

## [0.8.0](https://github.com/dvmrry/zscaler-skill/compare/v0.7.0...v0.8.0) (2026-06-12)


### Features

* **bridge:** self-contained multi-turn investigation harness driving Devin CLI with disk-truth verification ([#100](https://github.com/dvmrry/zscaler-skill/issues/100)) ([956f501](https://github.com/dvmrry/zscaler-skill/commit/956f501ce80f50c6261ed11af549bc414ffa1fa2))

## [0.7.0](https://github.com/dvmrry/zscaler-skill/compare/v0.6.0...v0.7.0) (2026-06-12)


### Features

* **investigator:** forge-lineage-5 hardening — no force over MCP, archiving re-init, evidence-gated claim transitions ([#96](https://github.com/dvmrry/zscaler-skill/issues/96)) ([490d5f3](https://github.com/dvmrry/zscaler-skill/commit/490d5f3b26efbcbc2ece86b9b0f51bc9b4450815))
* **investigator:** MCP 2025-11-25 conformance + resources + prompts ([#98](https://github.com/dvmrry/zscaler-skill/issues/98)) ([2e16166](https://github.com/dvmrry/zscaler-skill/commit/2e16166f6ccf86565c431c084d3631a9f53e0eed))
* **investigator:** MCP-first transport selection in the canonical workflow entry path ([#99](https://github.com/dvmrry/zscaler-skill/issues/99)) ([f40cbf2](https://github.com/dvmrry/zscaler-skill/commit/f40cbf267353634bccefcb9607ca933774aaf910))

## [0.6.0](https://github.com/dvmrry/zscaler-skill/compare/v0.5.3...v0.6.0) (2026-06-12)


### Features

* **investigator:** MCP stdio server transport for the helper gates ([#94](https://github.com/dvmrry/zscaler-skill/issues/94)) ([79eeae8](https://github.com/dvmrry/zscaler-skill/commit/79eeae82588a867fb4a5577dcb53dc6143a55ab3))

## [0.5.3](https://github.com/dvmrry/zscaler-skill/compare/v0.5.2...v0.5.3) (2026-06-12)


### Documentation

* **agents:** role cornerstones and declared-records convention (supersedes [#49](https://github.com/dvmrry/zscaler-skill/issues/49)) ([#91](https://github.com/dvmrry/zscaler-skill/issues/91)) ([fd086ad](https://github.com/dvmrry/zscaler-skill/commit/fd086add1fbb11032db1ba19954a3e9623b200a5))
* **plans:** cornerstone A/B experiment results — generic grounding wins, cosplay confirmed, premise-challenge is the active ingredient ([#92](https://github.com/dvmrry/zscaler-skill/issues/92)) ([f678311](https://github.com/dvmrry/zscaler-skill/commit/f6783113a1f071c6ab872c980ed2512809960a41))

## [0.5.2](https://github.com/dvmrry/zscaler-skill/compare/v0.5.1...v0.5.2) (2026-06-12)


### Documentation

* **zpa:** SDK/Postman deep dive — verified schema facts + cross-source divergence reference ([#89](https://github.com/dvmrry/zscaler-skill/issues/89)) ([5bb34c7](https://github.com/dvmrry/zscaler-skill/commit/5bb34c71750887def557e4a9dd7e48cfd74908ba))

## [0.5.1](https://github.com/dvmrry/zscaler-skill/compare/v0.5.0...v0.5.1) (2026-06-12)


### Bug Fixes

* **ci:** enforce full test suite, unblock Renovate, release token plumbing, and v0.5.0 doc-drift sweep ([#86](https://github.com/dvmrry/zscaler-skill/issues/86)) ([c1a1432](https://github.com/dvmrry/zscaler-skill/commit/c1a1432dae4eaace51539f08184a78d83c25606b))

## [0.5.0](https://github.com/dvmrry/zscaler-skill/compare/v0.4.6...v0.5.0) (2026-06-10)


### Features

* **investigator:** compound helper commands — one button press per gated phase ([#84](https://github.com/dvmrry/zscaler-skill/issues/84)) ([1fcf758](https://github.com/dvmrry/zscaler-skill/commit/1fcf7587f07a48e1f57e1007c08ece52b14bc922))
* **investigator:** record-loads Step 2 gate, status doctor command, and forge-resistant gate errors ([#82](https://github.com/dvmrry/zscaler-skill/issues/82)) ([7cc4880](https://github.com/dvmrry/zscaler-skill/commit/7cc48808d662f7515dcf4b49d0425e9483c0a848))

## [0.4.6](https://github.com/dvmrry/zscaler-skill/compare/v0.4.5...v0.4.6) (2026-06-09)


### Documentation

* **cloud-connector:** note ZTW location profile-tag asymmetry vs ZIA ([#80](https://github.com/dvmrry/zscaler-skill/issues/80)) ([158ea10](https://github.com/dvmrry/zscaler-skill/commit/158ea10c285a5266d45bc455687542141e19e972))

## [0.4.5](https://github.com/dvmrry/zscaler-skill/compare/v0.4.4...v0.4.5) (2026-06-09)


### Bug Fixes

* **docs:** correct invalid [@import](https://github.com/import) position and lint CSS in CI ([#76](https://github.com/dvmrry/zscaler-skill/issues/76)) ([de00f93](https://github.com/dvmrry/zscaler-skill/commit/de00f93419aa2e02090a73ec6db85cbf2315a053))

## [0.4.4](https://github.com/dvmrry/zscaler-skill/compare/v0.4.3...v0.4.4) (2026-06-09)


### Bug Fixes

* **docs:** sanitize the source viewer and dedup the docs JS ([#68](https://github.com/dvmrry/zscaler-skill/issues/68)) ([6f44076](https://github.com/dvmrry/zscaler-skill/commit/6f44076c5b3d78e4d43eb06f08ecb3e24fd2c978))

## [0.4.3](https://github.com/dvmrry/zscaler-skill/compare/v0.4.2...v0.4.3) (2026-06-09)


### Bug Fixes

* **scripts:** harden and dedup Node workflow helpers ([#66](https://github.com/dvmrry/zscaler-skill/issues/66)) ([a933305](https://github.com/dvmrry/zscaler-skill/commit/a933305e42e3cbd25e76c98aa9d62dffb00cd848))

## [0.4.2](https://github.com/dvmrry/zscaler-skill/compare/v0.4.1...v0.4.2) (2026-06-08)


### Documentation

* rework README to be value-first ([#64](https://github.com/dvmrry/zscaler-skill/issues/64)) ([ac8d787](https://github.com/dvmrry/zscaler-skill/commit/ac8d787cdebe9461d64249719beeb5a85102d818))

## [0.4.1](https://github.com/dvmrry/zscaler-skill/compare/v0.4.0...v0.4.1) (2026-06-08)


### Bug Fixes

* **release:** make docs commits trigger a patch bump ([#62](https://github.com/dvmrry/zscaler-skill/issues/62)) ([c1a442f](https://github.com/dvmrry/zscaler-skill/commit/c1a442fdcaa45732622ace9e6d9e9bc6e5f892e6))

## [0.4.0](https://github.com/dvmrry/zscaler-skill/compare/v0.3.0...v0.4.0) (2026-06-02)


### Features

* **zcc:** track Terraform provider coverage ([#59](https://github.com/dvmrry/zscaler-skill/issues/59)) ([c2d7442](https://github.com/dvmrry/zscaler-skill/commit/c2d74424aafc3cc6b463515e3885fef8bb846ad4))

## [0.3.0](https://github.com/dvmrry/zscaler-skill/compare/v0.2.0...v0.3.0) (2026-05-31)


### Features

* **refs:** recognize AI Guard coverage ([#55](https://github.com/dvmrry/zscaler-skill/issues/55)) ([476e50e](https://github.com/dvmrry/zscaler-skill/commit/476e50eaef8d1c2ee4affffa9dbeb80daa58d88b))

## [0.2.0] — 2026-05-18

The `v0.2.0` tag is the release anchor for this entry. 0.2.0 is the
runtime-migration line: canonical workflow logic was centralized and the
runtime surfaces reduced to thin loaders.

### Added

- Canonical `agents/<role>/workflow.md` entrypoint for every role
  (investigator, architect, auditor, researcher, retro, SOC, setup, and the
  ad-hoc `@zscaler` Q&A path). Each `workflow.md` owns its `required-reads`
  bootstrap list, command name, and adapter-pointer checks.
- Deterministic investigator gate: `scripts/investigator-artifacts.mjs`
  (`open-case` / `verify-case`, status recomputed from inputs rather than
  trusted), a turn-transaction ledger (`begin-turn` / `complete-turn`,
  helper-owned ordering token), and `abandon-turn` recovery for a blocked
  mid-turn so a case cannot wedge across a halt.
- Per-role `harness.md` (architect, auditor, retro, SOC) and `grounding/`
  index cards, right-sized per role rather than copied from investigator.
- `/z-researcher` as a canonical role (normalized from a `.claude`-only
  command to `agents/researcher/`).
- `scripts/prepare-overlay-submission.mjs`: validates selected `_data`
  artifacts against an allowlist, scans for credentials, and prepares an
  overlay branch without pushing by default.
- `scripts/check-data-contract.mjs` and `scripts/setup-data-mount.mjs` for the
  `_data` runtime mount; data-contract and Node helper regression suites wired
  into CI.
- This `CHANGELOG.md` and a top-level `VERSION` file.

### Changed

- `.devin/workflows/*`, `.claude/commands/*`, `.agents/skills/*`, and the
  repo-root `zscaler` loader are now thin pointers at the canonical workflows;
  the ~600-line Windsurf investigator body was removed in favor of the
  canonical contract.
- `_data` is documented and treated as a replaceable runtime mount, not repo
  content; its public shape lives in `docs/data-contract/`.
- Validators (`check-agent-skills.py`, `check-workflow-metadata.mjs`) enforce
  dependency coverage through `agents/<role>/workflow.md` instead of duplicated
  wrapper text.
- Zscaler upstream vendor submodules updated through `bc56b11`.

### Renamed

- `/z-investigator-load` → `/z-investigator-resume` (case resume entrypoint).
- The legacy `/researcher` command alias collapsed to `/z-researcher`.

### Fixed

- Citation-inventory baseline reconciled to the post-submodule-bump source
  count for `references/zpa/app-segments.md` (the long-standing red was the
  inventory lagging a legitimate upstream change, not a coverage loss); the
  citation gate remains blocking.
- README now linked `CHANGELOG.md` while none existed — this entry resolves
  that dangling reference.

### Known limitations

- Cascade-runtime behavior is validated by deterministic repo checks and
  proxy/representative smoke runs, not by automated Cascade regression.
  Off-smoke-path interpretation divergence is an accepted, bounded residual.
- Several live-tenant scripts remain scaffolded until response shapes can be
  validated against real deployments. The release ships the deterministic
  helper and contract-checking spine; tenant API completion remains explicit
  follow-up work.
- `author-status` is an authoring lifecycle field. For trust decisions, use
  each reference's `confidence`, `source-tier`, `sources`, and
  `verified-against` metadata.

## [0.1.0] — baseline

Pre-changelog baseline. No changelog was kept before 0.2.0; this is a marker,
not a reconstructed history. 0.1.0 denotes the skill prior to the
runtime-migration line: the Zscaler knowledge references, the original
investigator/architect/auditor/SOC/retro roles, snapshot tooling, and the
Windsurf/Claude adapters as full-bodied wrappers. See git history before
commit `e0c2255` for detail.
