# Federal and government cloud editions: FedRAMP, DoD IL5 and other certifications as marketed (portfolio.federal-clouds)
Also called: fedramp; fedramp high; fedramp moderate; federal clouds; government cloud; govcloud; gov cloud; zscalergov; zscaler government; public sector; dod il5; il5; cmmc; govramp; cjis; tic 3.0; zscaler federal

The public-sector page says ZIA is currently the only secure access service edge (SASE) Trusted Internet Connections (TIC) 3.0 solution with FedRAMP High authorization. [portfolio.federal-clouds:fed-zia-high] The page says ZIA and ZPA are both JAB-High authorized. [portfolio.federal-clouds:fed-jab] The page says ZIA and ZPA have been FedRAMP Moderate authorized since 2018. [portfolio.federal-clouds:fed-moderate]

The page says ZPA has achieved a Provisional Authorization (PA) at Impact Level 5 (IL5), as published in the DoW Cloud Computing Security Requirements Guide, and that ZIA has achieved Authorization to Operate (ATO) at Impact Level 2 (IL2). [portfolio.federal-clouds:fed-il5] The page's compliance section says Zscaler has achieved CMMC Level 2 certification, that ZIA Moderate Cloud has achieved GovRAMP Authorized status, and that Zscaler maintains compliance with CJIS, is compliant with FIPS 140-2, has achieved the ISO 27001 certificate and adheres to NIST 800-53. [portfolio.federal-clouds:fed-certs]

The page says the entire Zero Trust Exchange platform, including ZIA, ZPA and ZDX, is FedRAMP Moderate and High Authorized. [portfolio.federal-clouds:fed-products] Government host names and identity hosts are in [Reaching OneAPI on government (FedRAMP) and non-production clouds](kb:shared.oneapi.government-clouds); the cloud names are in [Zscaler cloud names: which cloud a tenant is on, and the production name list](kb:shared.cloud-architecture.cloud-names).

Whether the government cloud has dedicated infrastructure apart from the commercial cloud is open [gap:portfolio.federal-clouds:fed-dedicated]. Whether new features reach it later is open [gap:portfolio.federal-clouds:fed-features], and where its data is stored is open [gap:portfolio.federal-clouds:fed-residency].

Federal adoption figures are open [gap:portfolio.federal-clouds:fed-adoption]. Whether the government editions are variants of each product is open [gap:portfolio.federal-clouds:fed-editions]. The Terraform ZPA provider's documentation lists GOV and GOVUS in its supported ZPA cloud names. [portfolio.federal-clouds:fed-names-zpa] The Terraform ZTC provider's documentation lists zscalergov and zscalerten in its supported cloud names. [portfolio.federal-clouds:fed-names-zscalerten] Whether zscalerten is a government cloud is open [gap:portfolio.federal-clouds:fed-names]. The innovations document the legacy doc cites is not captured [gap:portfolio.federal-clouds:fed-govcloud-capture].

What to check:
1. For a question about certifications, answer as the page markets them and name the authorization level and product scope the page gives.

Not known (open gaps):
- The government cloud innovations document [gap:portfolio.federal-clouds:fed-govcloud-capture]: settled by source-read
- Whether government cloud infrastructure is dedicated [gap:portfolio.federal-clouds:fed-dedicated]: settled by source-read
- Whether features reach the government cloud later than commercial [gap:portfolio.federal-clouds:fed-features]: settled by source-read
- Where government cloud data is stored [gap:portfolio.federal-clouds:fed-residency]: settled by source-read
- Federal adoption figures [gap:portfolio.federal-clouds:fed-adoption]: settled by source-read
- Whether government editions are variants of each product [gap:portfolio.federal-clouds:fed-editions]: settled by source-read
- Government cloud names beyond the captured hosts [gap:portfolio.federal-clouds:fed-names]: settled by source-read

Area: portfolio.federal-clouds, its subjects in references/_meta/spine/portfolio/portfolio.federal-clouds.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.cloud-architecture.cloud-names.md (Zscaler cloud names: which cloud a tenant is on, and the production name list)
- links-to references/_meta/text/shared/shared.oneapi.government-clouds.md (Reaching OneAPI on government (FedRAMP) and non-production clouds)
