"Why was this file blocked, or why was it not?" needs four questions answered in order.

1. **Does a rule exist and is it enabled?** With no matching rule every file type is allowed, and a new rule starts disabled: [[zia.file-type-control.actions]].
2. **Do the rule's criteria match this file?** File type (including unknown and inside archives), size, active content, unscannable and password-protected conditions, protocols and scope: [[zia.file-type-control.criteria]].
3. **Did the traffic reach File Type Control, and in what order?** Decryption, the position relative to Malware Protection, DLP and Sandbox, and the 400 MB scanning limit: [[zia.file-type-control.pipeline]]. For FTP flows start with [[zia.ftp-control]].
4. **What does the match do?** Allow, Caution or Block, in the rule's direction: [[zia.file-type-control.actions]].

For tenant data and automation, field names, enums and the custom file type endpoints are in [[zia.file-type-control.api-shape]]. SSH is not a File Type Control or inspection topic: [[zia.ssh-control]].
