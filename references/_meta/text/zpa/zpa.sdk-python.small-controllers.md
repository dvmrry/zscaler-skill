# Python SDK controllers whose verbs or names are not what they look like (zpa.sdk-python.small-controllers)
Also called: admin sso update post; update_sso_controller; session termination on reauth sdk; zia cloud config sdk; verify_oauth2_user_code; add_provisioning_key oauth2 usercodes status

A few Python ZPA controllers send a different HTTP verb or carry a different method name from what their purpose suggests. The method lists themselves are in the generated surface.

**Admin SSO.** `update_sso_controller` sends POST to `/ssoLoginOptions` on the `/v2`-suffixed base, the same route `get_sso_controller` reads with GET. [zpa.sdk-python.small-controllers:admin-sso-post]

**ZIA customer config.** The ZIA customer config module reads availability with GET `/config/isZiaCloudConfigAvailable`, writes the cloud service config with POST `/config/ziaCloudConfig`, and writes session termination on reauth with PUT `/config/sessionTerminationOnReauth`. [zpa.sdk-python.small-controllers:zia-config-methods]

**OAuth user codes.** In the OAuth user-code module `verify_oauth2_user_code` posts to `/usercodes`, and the method named `add_provisioning_key` posts to `/usercodes/status`. [zpa.sdk-python.small-controllers:oauth-add-provisioning-key]

What to check:
1. Which verb the Admin SSO update sent: it is a POST on the same route its read uses.
2. Whether the ZIA integration call was a cloud-config write (POST) or a session-termination write (PUT).
3. Whether an OAuth user-code call went to usercodes or usercodes/status, since the status route is on a method called add_provisioning_key.

Area: zpa.sdk-python, its subjects in references/_meta/spine/zpa/zpa.sdk-python.json
