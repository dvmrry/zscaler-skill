The time zone used to evaluate an interval depends on who the user is, not on where they are. {{known-location}} {{remote-user}}

Help's worked example makes the difference concrete. {{worked-example}} Both users were physically in London at the same moment; only the one tied to a configured location got the London clock.

So the answer to "why did the rule fire at 4 PM for her?" is a check of which clock applied. {{window-follows-location-not-user}} Confirm the user's traffic matches a configured location ([[zia.locations.model]] says how an unmatched Client Connector user is tagged Road Warrior) and read that location's time zone ([[zia.locations.country-timezone]] explains the enum values). Remember that the same Help set words the rule slightly differently: {{rule-locations-wording}} That wording leaves one question open, tracked as gap `rule-locations-versus-user-location`.

No override is documented. {{no-override-documented}}

Daylight saving is not covered by any source: see gap `dst-handling`. Treat a rule whose window seems to shift by an hour twice a year as unconfirmed until tested (what happens outside the window is in [[zia.time-intervals.evaluation]]).
