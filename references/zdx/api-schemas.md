---
product: zdx
topic: "api-schemas"
title: "ZDX API resource schemas"
content-type: reference
last-verified: "2026-04-28"
confidence: high
source-tier: code
sources:
  - "vendor/zscaler-sdk-go/zscaler/zdx/services/**"
author-status: draft
---

# ZDX API resource schemas

Resource-level schemas for the ZDX API, extracted from the Go SDK service layer.


## Department

**Service:** `administration`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string | ✓ |  |

## Location

**Service:** `administration`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string | ✓ |  |

## Alert

**Service:** `alerts`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| RuleName | rule_name | string | ✓ |  |
| Severity | severity | string | ✓ |  |
| AlertType | alert_type | string | ✓ |  |
| AlertStatus | alert_status | string | ✓ |  |
| NumGeolocations | num_geolocations | int | ✓ |  |
| NumDevices | num_devices | int | ✓ |  |
| StartedOn | started_on | int | ✓ |  |
| EndedOn | ended_on | int | ✓ |  |
| Application | application | Application | ✓ |  |
| Departments | departments | []Department | ✓ |  |
| Locations | locations | []Location | ✓ |  |
| Geolocations | geolocations | []Geolocation | ✓ |  |

## Application

**Service:** `alerts`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string |  |  |

## Department

**Service:** `alerts`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string |  |  |
| NumDevices | num_devices | int |  |  |

## Device

**Service:** `alerts`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string |  |  |
| UserID | userid | int |  |  |
| UserName | userName | string |  |  |
| UserEmail | userEmail | string |  |  |

## Geolocation

**Service:** `alerts`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | string |  |  |
| Name | name | string |  |  |
| NumDevices | num_devices | int |  |  |

## Group

**Service:** `alerts`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string |  |  |

## Location

**Service:** `alerts`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| ID | id | int |  |  |
| Name | name | string |  |  |
| NumDevices | num_devices | int |  |  |
| Groups | groups | []Group |  |  |

## DataPoint

**Service:** `common`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| TimeStamp | timestamp | int | ✓ |  |
| Value | value | float64 | ✓ |  |

## Metric

**Service:** `common`

| Field | JSON tag | Type | Optional | Notes |
|---|---|---|---|---|
| Metric | metric | string | ✓ |  |
| Unit | unit | string | ✓ |  |
| DataPoints | datapoints | []DataPoint |  |  |
