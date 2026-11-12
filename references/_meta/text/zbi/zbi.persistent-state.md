# Persistent State and cookie persistence in isolation: what is purged, what is restored, retention and size limits (zbi.persistent-state)
Also called: persistent state; isolation session restore; isolated browser expires; cookie persistence; persisting session data

The isolated browser expires and closes after 10 minutes of user inactivity, and by default all the data in the expired browser, including content and state, is purged. [zbi.persistent-state:default-purge-10min] Persistent State must be enabled on the user's isolation profile; when enabling it in the profile wizard a consent message is shown, and if it is not enabled the data is destroyed with the container when the user logs out or exceeds the session timeout. [zbi.persistent-state:enable-in-profile]

**Restoring.** The user starts restoring by clicking the URL refresh button inside the isolated container; a brand-new isolation session then restores the authentication state for apps and browsing history from the last session, unless the feature was disabled on the profile between the old and new session. [zbi.persistent-state:restore-behavior] If a user fails to restore a session three or more times, or the restored browser does not load, the article says to have them contact their Zero Trust Browser admin. [zbi.persistent-state:restore-failure]

**Storage.** Persisting session information is backed up encrypted to the Zscaler cloud, purged permanently if not restored for 15 days, purged as soon as persistent state is disabled for the user, and cannot exceed 100 MB. [zbi.persistent-state:storage-retention-limits]

**Cookie persistence.** When the profile has the Cookie Persistence setting enabled in Security Controls, cookies migrate from existing or previous sessions to new sessions, but only within the same browser type (Chrome sessions share with Chrome sessions, not Firefox). [zbi.persistent-state:cookie-persistence] Whether a profile setting by that name exists in the profile wizards is open [gap:zbi.persistent-state:cookie-setting-location].

What a new container keeps otherwise is in [How Cloud Browser isolates a page: remote browser, traffic flow, containers and the idle timeout](kb:zbi.cloud-browser).

What to check:
1. Whether Persistent State is enabled on the user's isolation profile, and whether it was disabled between the old and new session.

Not known (open gaps):
- Where the Cookie Persistence setting appears in the isolation profile wizards [gap:zbi.persistent-state:cookie-setting-location]: settled by source-read or lab-test. Blocks: telling an admin where to enable cookie persistence

Area: zbi.persistent-state, its subjects in references/_meta/spine/zbi/zbi.persistent-state.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zbi/zbi.cloud-browser.md (How Cloud Browser isolates a page: remote browser, traffic flow, containers and the idle timeout)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zbi/zbi.isolation-profiles.md (Isolation profiles: the object every isolation rule names, its defaults and the open lifecycle questions)
- see-also references/_meta/text/zbi/zbi.end-user-experience.md (What the user sees in isolation: experience modes, menus, Original URL, bookmarks, mobile, translation, read-only and extensions)
