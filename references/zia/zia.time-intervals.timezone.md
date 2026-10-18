The time zone used to evaluate an interval depends on who the user is, not on where they are. {{known-location}} {{remote-user}}

{{worked-example}}

{{window-follows-location-not-user}} The location model is in [[zia.locations.model]], and the time zone values are in [[zia.locations.country-timezone]]. {{rule-locations-wording}} Whose location sets the zone when a rule selects other locations is open {{gap:rule-locations-versus-user-location}}.

{{no-override-documented}}

Whether daylight saving applies is open {{gap:dst-handling}}. What happens outside the window is in [[zia.time-intervals.evaluation]].
