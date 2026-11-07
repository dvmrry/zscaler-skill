# Synthetic fixture: not real tenant data.
resource "zia_url_filtering_rules" "block_gambling" {
  name   = "Block gambling"
  action = "BLOCK"
  order  = 1
}
