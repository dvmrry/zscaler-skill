# Understanding Predefined DLP Dictionaries

**Source:** https://help.zscaler.com/zia/understanding-predefined-dlp-dictionaries
**Captured:** 2026-04-24 via Playwright MCP (bundled chromium rendering the JS-served page; `innerText` extraction of `article`).

---

Internet & SaaS (ZIA) Help 
Policies 
Data Loss Prevention 
DLP Dictionaries & Engines 
Understanding Predefined DLP Dictionaries
Internet & SaaS (ZIA)
Understanding Predefined DLP Dictionaries
Ask Zscaler

Zscaler provides the following Data Loss Prevention (DLP) dictionaries. Dictionaries marked with an asterisk (*) are not supported for Endpoint DLP. To learn more, see About Endpoint DLP. To learn more about configuring predefined DLP dictionaries, see Editing Predefined DLP Dictionaries.

Aadhaar Card Number (India)

This dictionary detects Aadhaar Unique Identification (UID) numbers from India.

The popular format for an Aadhaar UID number is a 12-digit number, separated at the 4th and 8th digits by a delimiter. The delimiter can be a period, hyphen, or space.

The following are examples of popular formats:

NNNNNNNNNNNN
NNNN-NNNN-NNNN

This dictionary uses the Verhoeff checksum.

The Predefined dictionary only counts unique Aadhaar card UID numbers; multiple instances of the number are blocked.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	

The dictionary counts an instance as a violation if the Aadhaar UID number matches a valid range.

The Aadhaar UID number can contain:

A period, hyphen, or space as delimiters. Multiple periods, hyphens, and spaces are allowed.
An alphabetical boundary.
	

The number formats that can trigger the dictionary are:

Q2161 6729 3627O
8384-2795-9970

A number format like 2@075-8515-612d5 does not trigger the dictionary.


Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The Aadhaar UID number is in a popular format.

The Aadhaar UID number can contain a non-alphanumeric boundary. It cannot be bound by alphabetical characters.

The Aadhaar UID number must use the same delimiters for the full number.

	

The number formats that can trigger the dictionary are:

@216167293627@
8384-2795-9970

The number formats that do not trigger the dictionary are:

2075-8515/6125
F838427959970B

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The Aadhaar UID number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, Aadhaar Card, UID, or UIDAI number.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

@216167293627@
8384-2795-9970

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

2075-8515/6125
F838427959970B
Close
ABA Bank Routing Numbers

This dictionary detects ABA routing transit numbers from the United States.

The popular format for an ABA routing transit number is a 9-digit number that has no delimiters.

An example of a popular format is NNNNNNNNN.

This dictionary uses the Luhn checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	

The dictionary counts an instance as a violation if the ABA routing transit number matches a valid range.

The ABA routing transit number can contain a period, hyphen, or space as delimiters. Multiple periods, hyphens, and spaces are allowed.

	

The number formats that can trigger the dictionary are:

021---302---567
053 9021 97
QQ036001808//
011...600...033

The number formats that do not trigger the dictionary are:

50dd86d97067
aa8543210bb74

Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The ABA routing transit number is in a popular format.

The ABA routing transit number can not contain a period, hyphen, or space as delimiters. No delimiters are allowed.

	

The number formats that can trigger the dictionary are:

053902197
036001808
011600033

The number formats that do not trigger the dictionary are:

021---302---567
50dd86d97067
aa8543210bb74

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The ABA routing transit number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, aba routing number, aba number, american bank association routing number, bank routing number, or routing transit number.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

021302567
053902197
036001808
011600033

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

50dd86d97067
aa8543210bb74
Close
Addresses (Japan)*

This dictionary is disabled by default. To access this feature, contact your Zscaler Account team.

This dictionary detects content related to addresses from Japan.

This dictionary does not use a checksum.

The following are examples of acceptable formats for Japanese Addresses:

〒064-0807 北海道札幌市中央区南七条西２ー４ー４ (full address with hyphen as delimiter)
〒064-0807 北海道札幌市中央区南七条西２丁目４番４号 (full address with kanji]
札幌市中央区南七条西2の4の4 (postal code optional)
札幌市中央区南七条西2丁目4-4 (postal code is optional)
新宿区高田馬場1-7-2 (postal code and prefecture are optional)
新宿区高田馬場1丁目7の2 (postal code and prefecture are optional)

You can also specify an Action to configure how the dictionary evaluates matching names:

Count All: The dictionary counts all matches of the name, including identical names, toward the match count.
Count Unique: The dictionary counts each unique match of the name toward the match count only once, regardless of how many times the name appears.
Close
Adult Content

This dictionary detects adult or mature content.

The popular format for adult or mature content is sexually explicit keywords, as well as foul language words.

This dictionary does not use a checksum.

You can modify the Confidence Score Threshold. Confidence scores inform the dictionary how high it must raise the bar, or threshold, for identifying violations and triggering them. To learn more, see Configuring the Confidence Score Threshold.

Close
Argentina Uniform Bank Code (CBU)

This dictionary detects Argentina's Clave Bancaria Uniforme (CBU).

This code is used to identify bank accounts for electronic transfers. It combines bank, branch, and account details into a single identifier.

This dictionary uses the Modulo 10 checksum. This checksum is similar to the Luhn checksum.

The popular format is 22-digits (no delimiter).

The CBU has the following structure:

3 digits: Banck Code
4 digits: Branch Code
1 digit: Check Digit (bank/branch)
13 digits: Account Number
1 digit: Check Digit (account)

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	

The dictionary counts an instance as a violation if:

The CBU is in a popular format.
The CBU can be validated by Luhn checksum.
	

The number formats that can trigger the dictionary are:

12 345674 12345678901233
12.345674.12345678901233
12 -345674 .12345678901233

A number format like 1234567412345678901234 does not trigger the dictionary.


Medium	

This dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The CBU is in a popular format.
	

A number format like 1234567412345678901233 can trigger the dictionary.

The number formats that do not trigger the dictionary are:

12 345674 12345678901233
12.345674.12345678901233
12 -345674 .12345678901233

High	

This dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The CBU is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, CBU, Clave Bancaria Uniforme, Bank Code, Argentina, or Account#.
	

A number format like 1234567412345678901233 can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

12 345674 12345678901233
12.345674.12345678901233
12 -345674 .12345678901233
Close
Australia Passport Number

This dictionary detects passport numbers (AUPP) from Australia.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the AUPP number matches a valid range.	

Number formats that trigger the dictionary:

N1234567
NN123456
N 1234567

The number formats that do not trigger the dictionary are:

N12345 67
Q1234567 (invalid first letter)
PG123456 (invalid letter combination)

Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The AUPP number is in a popular format.
	

A number format like N1234567 or NN123456 triggers the dictionary.

The number formats that do not trigger the dictionary are:

N 1234567
N12345 67
PA123-456 (delimiter in wrong place)

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The AUPP number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, passport, passport number, passportno, passport num, immigration and citizenship, issuing authority, national identity card, passport details, and travel document.
	

A number format like N1234567 or NN123456 triggers the dictionary.

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

N 1234567
N12345 67
PG 123456
Close
Bulgaria Uniform Civil Number

This dictionary detects uniform civil numbers (EGN) from Bulgaria.

This dictionary uses the Modulo 11 checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the EGN number matches a valid range.	

The number formats that can trigger the dictionary are:

752 316 9263
7 -52/.316 926...- 3

A number format like 7523169264 (invalid checksum) will not trigger the dictionary.


Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The EGN number is in a popular format.
	

A number format like 7523169263 triggers the dictionary.

The number formats that do not trigger the dictionary are:

752 316 9263
7 -52/.316 926...- 3

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The EGN number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, bucn, egn, vim, uniform civil number, and unified civil number.
	

A number format like 7523169263 triggers the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases.

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

752 316 9263
7 -52/.316 926...- 3
Close
Cambodian National ID (KIdC)

This dictionary detects Cambodia/Khmer Identification Code (KIdC).

This is a unique personal identification code that is a 9-digit number followed by a checksum letter.

Specific checksum calculation details are not public. However, the National Strategic Plan of Identification 2017-2026 indicates that Mod 11 checksum is used.

The popular format is 10-digits (no delimiter) or 9-digits followed by a hyphen and check digit.

The following are examples of popular formats:

1234567890
123456789-0

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	

The dictionary counts an instance as a violation if:

The Cambodia Identification Code (KIdC) is in a popular format.
The Cambodia Identification Code (KIdC) can be validated by Luhn checksum.
	

The number formats that can trigger the dictionary are:

42 845 678 96
42.845.678..96
42 -845 .678 9...-6

A number format like 4284567891 does not trigger the dictionary.


Medium	

This dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The Cambodia Identification Code (KIdC) is in a popular format.
	

The number formats that can trigger the dictionary are:

4284567896
428456789-6

The number formats that do not trigger the dictionary are:

42 845 678 96
42.845.678..96
42 -845 .678 9...-6

High	

This dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The Cambodia Identification Code (KIdC) is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, KIdC, National Identification, Identification Code, Cambodia, Khmer, or ID#.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

4284567896
428456789-6

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

42 845 678 96
42.845.678..96
42 -845 .678 9...-6
Close
Citizen Service Numbers (Netherlands)

This dictionary detects citizen service numbers (BSN) from the Netherlands.

The popular format for a citizen service number is a 9-digit number that can be separated by a hyphen after 3 digits.

An example of a popular format is NNNNNNNNN.

This dictionary uses the Mod 11 Check Digit checksum. This checksum is similar to the Luhn checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the citizen service number matches a valid range.	

The number formats that can trigger the dictionary are:

132...240774
096195435
25 8662700
2444--52155
041143401

Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The citizen service number is in a popular format.
	

The number formats that can trigger the dictionary are:

096195435
@244452155@
041143401

The number formats that do not trigger the dictionary are:

132...240774
25 8662700

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The citizen service number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, Citizen service number, BSN, Burgersservicenumber, Sofinummer, Persoonsgebonden nummer, Persoonsnummer, or Personal Number.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

096195435
@244452155@
041143401

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

132...240774
25 8662700
Close
CNPJ Number (Brazil)

This dictionary detects the 14-digit Brazilian National Registry of Legal Entities (CNPJ) number.

This dictionary uses the Mod 11 checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the CNPJ number matches a valid range.	

The number formats that can trigger the dictionary are:

44 455 566 0001 88
44.455/5660001...88
44 -455/ .566 0001...-88

A number format like 44455566000185 does not trigger the dictionary (bad checksum).


Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The CNPJ number is in a popular format.
	

A number format like 44.455.566/0001-88 triggers the dictionary.

The number formats that do not trigger the dictionary are:

44455566000188
44 455 566 0001 88
44 -455/ .566 0001...-88
44.455.566/0001 88

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The CNPJ number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, CNPJ, Cadastro Nacional da Pessoa Jurídica, National Registry of Legal Entities, and CNPJ#.
	

A number format like 44.455.566/0001-88 triggers the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases.

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

44455566000188
44 455 566 0001 88
44 -455/ .566 0001...-88
44.455.566/0001 88
Close
Corporate Finance Document

This dictionary detects corporate finance documents, like earnings reports, Form 10-K, etc.

Zscaler supports only the following document types for corporate finance documents: RTF, PDF, MSG, DOC, DOCX, DOCM, DOTX, DOTM, XLS, XLSX, XLSM, XLTM, PPT, PPTX, PPSX, PPTM, POTM, POTX, and IWORK (pages, numbers, and keynote). To detect sensitive content, this dictionary requires at least 1 KB of extracted content from a supported corporate finance document file.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria
Low	This dictionary counts an instance as a violation if the Machine Learning (ML) match score is 50 or more.
Medium	This dictionary counts an instance as a violation if the ML match score is 70 or more.
High	This dictionary counts an instance as a violation if the ML match score is 90 or more.
Close
Corporate Legal Document

This dictionary detects corporate legal documents, like LLC operational agreements, Secretary of State forms, etc.

Zscaler supports only the following document types for corporate legal documents: RTF, PDF, MSG, DOC, DOCX, DOCM, DOTX, DOTM, XLS, XLSX, XLSM, XLTM, PPT, PPTX, PPSX, PPTM, POTM, POTX, and IWORK (pages, numbers, and keynote). To detect sensitive content, this dictionary requires at least 1 KB of extracted content from a supported corporate legal document file.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria
Low	This dictionary counts an instance as a violation if the Machine Learning (ML) match score is 50 or more.
Medium	This dictionary counts an instance as a violation if the ML match score is 70 or more.
High	This dictionary counts an instance as a violation if the ML match score is 90 or more.
Close
Corporate Number (Japan)

This dictionary detects Corporate Numbers from Japan.

You can modify the Confidence Score Threshold:

Low: The dictionary counts an instance as a violation if it matches a valid range.
Medium: The dictionary counts an instance as a violation if:
The requirements of Low Confidence are met.
The Corporate Number is in a popular format.
High: The dictionary counts an instance as a violation if:
The requirements of Medium Confidence are met.
The Corporate Number is accompanied by any of the dictionary’s default or custom high confidence phrases.
Close
Court Document

This dictionary detects court documents, like attorney forms, witness subpoenas, etc.

Zscaler supports only the following document types for court documents: RTF, PDF, MSG, DOC, DOCX, DOCM, DOTX, DOTM, XLS, XLSX, XLSM, XLTM, PPT, PPTX, PPSX, PPTM, POTM, POTX, and IWORK (pages, numbers, and keynote). To detect sensitive content, this dictionary requires at least 1 KB of extracted content from a supported court document file.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria
Low	This dictionary counts an instance as a violation if the Machine Learning (ML) match score is 50 or more.
Medium	This dictionary counts an instance as a violation if the ML match score is 70 or more.
High	This dictionary counts an instance as a violation if the ML match score is 90 or more.
Close
Credentials and Secrets

This dictionary allows you to select one or more credentials and secrets dictionaries (i.e., tokens, keys, passwords, etc.) for the following:

Amazon MWS Auth Token
Git Token
GitHub Token
Google API Key
Google OAuth Access Token
Google OAuth ID
JWT Token
PayPal Braintree Access Token
Picatic API Key
Private Key
SendGrid API Key
Slack Access Token
Slack Webhook
Square Access Token
Square OAuth Secret
Stripe API Key

See image.

Close

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria
Medium	This dictionary counts an instance as a violation if any of the selected sensitive credentials and secrets are matched.
High	

This dictionary counts an instance as a violation if any of the selected sensitive credentials and secrets are matched with a custom high confidence phrase.

If you set the Confidence Score Threshold to High, you must specify at least one Custom High Confidence Phrase.

Close
Credit Cards

This dictionary detects content related to credit card numbers.

When you add the Credit Cards dictionary to a DLP engine, you must configure the match count. To learn more, see Configuring the Match Count.

See image.

Close

The popular format for a credit card number is a range from 12-19 numeric digits, separated after every 4 digits by a delimiter that is checked for similarity and is correctly spaced. The delimiter can be a slash, period, hyphen, or space.

The following are examples of popular formats:

AMEX (15 digits)
NNNN<delimiter>NNNNNN<delimiter>NNNNN
Diner's Club (14 digits)
NNNN<delimiter>NNNNNN<delimiter>NNNN
Other Credit Cards (16 digits)
NNNN<delimiter>NNNN<delimiter>NNNN<delimiter>NNNN
NNNN NNNN NNNN NNNN

This dictionary uses the Luhn checksum.

To use this dictionary to detect credit card numbers, the following guidelines apply:

These guidelines might not apply to certain use cases. You can adjust your dictionary configurations according to your DLP needs.

To catch a small exfiltration of numbers in documents:
Set a Confidence Score Threshold of High for the dictionary.
When adding a dictionary to an engine, set a low value for the dictionary's match count.
To catch a large exfiltration of numbers in spreadsheets or other file types:
Set a Confidence Score Threshold of Medium for the dictionary.
When adding a dictionary to an engine, set a high value for the dictionary’s match count.
In general, configuring a dictionary with a Low Confidence Score Threshold and a low match count value results in too many false positives. Zscaler recommends setting a Confidence Score Threshold of High when its match count value is low.
Rich Text Format (RTF) files contain formatting code that can mimic credit card and social security numbers, affecting when a DLP rule is triggered. Plain text files do not contain this formatting code, therefore the DLP rule triggers as expected. So that the DLP policy triggers if confidential numbers are leaked in RTF files, do one of the following steps:
Set any value greater than 1 for the dictionary’s match count in the engine.
Set a Confidence Score Threshold value of High.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	

The dictionary counts an instance as a violation if:

The credit card number matches the length of at least one provider.
The credit card number can be validated by Luhn checksum.

The credit card number can contain a period, hyphen, or space as delimiters. Multiple periods, hyphens, and spaces are allowed.

	

The number formats that can trigger the dictionary are:

491-6710478214413
491-67...104782 14413
47 1697--47625799...21
36839-32 9773518
53721 653983--86508
4716 7361 13842732 (Valid length and can be validated by Luhn checksum)

The number formats that do not trigger the dictionary are:

aa5269946762375011aa
4716 7361 1384 2731 (Cannot be validated by the Luhn checksum)

Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The credit card number is in a popular format.
The credit card number, the length, and starting range of the number match that of the credit card providers.

The credit card number must use the same delimiters for the full number. Plus, the delimiters must be equally spaced.

	

The number formats that can trigger the dictionary are:

4716-9747-6257-9921
5372165398386508
4716 7361 1384 2732

The number formats that do not trigger the dictionary are:

4916:7104-7821 4413
49167-104-7821-4413
a3683:9329:773-518a

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The credit card number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, Amex, MasterCard, Visa, CVV Code, CCV Number, select card type, Discover, Diners Club, jcb, pay with checking account, pay check money order, credit card number, card holder name, or expiration date.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

4716-9747-6257-9921
5269:9467:6237:5011
5372165398386508
4716 7361 1384 2732

A number like a3683:9329:773-518a does not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases.

If a violation is enough to trigger a DLP policy and you have configured a DLP email notification, your auditors receive an email. If you have also included the ${DLPTRIGGERS} macro, the email includes what content triggered the violation.

See image.

Close

Close
Diseases Information

This dictionary uses phrase matching to detect content related to diseases information. It does not use a checksum.

You can specify an Action to configure how the dictionary evaluates matching disease names:

Count All: The dictionary counts all matches of the disease name, including identical disease names, toward the match count.
Count Unique: The dictionary counts each unique match of the disease name toward the match count only once, regardless of how many times the disease name appears.
Close
Driver’s License (United States)

This dictionary allows you to select driver's license dictionaries for one or more of the 50 U.S. states plus the District of Columbia.

See image.

Close

This legacy dictionary has been replaced, but not deprecated, by the Enhanced Driver's License (United States) predefined dictionary, which allows you to customize sub-dictionaries for each of the 50 U.S. states, plus the District of Columbia.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria
Medium	This dictionary counts an instance as a violation if the selected driver's license is matched.
High	The requirements of Medium Confidence are met and the driver's license is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, Driver's License, Driver's License number, DL#, 2-letter state codes (e.g., CA for California or WA for Washington).

The Proximity Length field appears when the dictionary’s Confidence Score Threshold is High. The proximity length defines how close a high confidence phrase must be to an instance of the pattern (that the dictionary detects) to count as a match. The phrase can be located in any direction from the pattern within the document. Enter a value from 0–10,000 bytes. A proximity length of 0 disables this option (i.e., the phrase can be any distance from the pattern).

Close
Drugs Information

This dictionary uses phrase matching to detect content related to drug information. It does not use a checksum.

You can specify an Action to configure how the dictionary evaluates matching drug names:

Count All: The dictionary counts all matches of the drug name, including identical drug names, toward the match count.
Count Unique: The dictionary counts each unique match of the drug name toward the match count only once, regardless of how many times the drug name appears.
Close
Enhanced Driver's License (United States)

This dictionary allows you to select driver's license dictionaries for one or more of the 50 U.S. states, plus the District of Columbia. Additionally, you can set the Confidence Score Threshold, Proximity Length, and Custom High Confidence Phrases for each state sub-dictionary.

See image.

Close

The following table lists the confidence score threshold criteria for this dictionary, using the Alabama and Alaska sub-dictionaries as an example. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Medium	This dictionary counts an instance as a violation if the selected state's driver's license number is matched.	

For an engine that uses the Alabama and Alaska sub-dictionaries with Medium Confidence Score:

1234567 triggers both sub-dictionaries
12345678 triggers the Alabama sub-dictionary only

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The driver's license number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, Drivers License, Drivers License Number, DL#, and State name (i.e., Alabama, Alaska, etc.) for the corresponding sub-dictionary.
	

For an engine that uses the Alabama and Alaska sub-dictionaries with High Confidence Score:

1234567 does not trigger either sub-dictionary
Driver's License 1234567 triggers both sub-dictionaries
Driver's License 12345678 triggers the Alabama sub-dictionary only
Alabama 1234567 triggers the Alabama sub-dictionary only
Alaska 1234567 triggers the Alaska sub-dictionary only
Close
Financial Statements

This dictionary detects content related to financial statements. It detects a financial document based on machine learning which clusters keywords that typically occur in financial documents. Examples of keywords are Accounts Payable, Common Stock, Current Liabilities, and so on.

This dictionary does not use a checksum.

You can modify the Confidence Score Threshold. Confidence scores inform the dictionary how high it must raise the bar, or threshold, for identifying violations and triggering them. To learn more, see Configuring the Confidence Score Threshold.

Close
First Names (Japan)*

This dictionary detects content related to First Names from Japan.

This dictionary does not use a checksum.

The following are examples of acceptable formats for Japanese First Names:

三郎
清子
美代子
四郎

You can also specify an Action to configure how the dictionary evaluates matching names:

Count All: The dictionary counts all matches of the name, including identical names, toward the match count.
Count Unique: The dictionary counts each unique match of the name toward the match count only once, regardless of how many times the name appears.
Close
Fiscal Code (Italy)

This dictionary detects Italian fiscal codes from Italy.

The popular format for an Italian fiscal code is a 16-character alphanumeric code that has no delimiters.

An example of a popular format is FFF-NNN-YYMDD-RRRRC. It has the following structure:

FFF: Represents the first three letters of the last name.
NNN: Represents the first three letters of the first name.
YYMDD: Represents the date of birth.
YY: Represents the year.
M: Represents the month. It is represented by a letter that maps to a month.
DD: Represents the date.
RRRR: Represents the town of birth. It is represented by alphnumeric characters.
C: Represents the checksum value. It is represented by a letter.

This dictionary uses the Mod 26 Check Digit checksum (maps to a letter A-Z).

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	

The Fiscal Code (Italy) dictionary is a regex based dictionary. It is more strict in formatting, even in low confidence. The special characters must be in the right positions. There could be a mix of different special characters, and there may even be consecutive special characters at the right positions, but they cannot be in the wrong positions.

The dictionary counts an instance as a violation if the Italian fiscal code matches a valid range.

The Italian fiscal code can contain only a period, hyphen, or space as delimiters. Multiple periods are allowed for a low confidence score.

	

The number formats that can trigger the dictionary are:

RSS MRA 70A41 F205Z
KAYSAN92D03L246A
RSS MRA- ... 70A41F205Z
KAYSAN 92D03L246 ... A

The number formats that do not trigger the dictionary are:

RSS MRA70A41F20 5Z
KAYSAN9 2D03L246A

Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The Italian fiscal code is in a popular format.
	

The number formats that can trigger the dictionary are:

RSS MRA 70A41 F205Z
KAYSAN92D03L246A

The number formats that do not trigger the dictionary are:

RSS MRA- ... 70A41F205Z
KAYSAN 92D03L246 ... A

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The Italian fiscal code is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, codice fiscal, repubblica italiana, Italian fiscal code, or Italian tax code.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

RSS MRA 70A41 F205Z
KAYSAN92D03L246A

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

RSS MRA- ... 70A41F205Z
KAYSAN 92D03L246 ... A
Close
Full Names (Japan)*

This dictionary detects content related to Full Names from Japan.

This dictionary does not use a checksum.

For example, if the First Name is 富市, and the Last Name is 村山, the following are examples of acceptable formats for Japanese Full Names:

村山富市 (no delimiters)
村山 富市 (spaces as delimiter)
村山　富市 (unicode space as delimiter)
村山,富市 (ASCII comma as delimiter)

You can also specify an Action to configure how the dictionary evaluates matching names:

Count All: The dictionary counts all matches of the name, including identical names, toward the match count.
Count Unique: The dictionary counts each unique match of the name toward the match count only once, regardless of how many times the name appears.
Close
Gambling

This dictionary detects content related to gambling. It detects documents that have keywords related to both online and physical gambling and betting.

This dictionary does not use a checksum.

You can modify the Confidence Score Threshold. Confidence scores inform the dictionary how high it must raise the bar, or threshold, for identifying violations and triggering them. To learn more, see Configuring the Confidence Score Threshold.

Close
ID Card

This dictionary detect images of ID Cards, such as licenses and passports.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the Confidence Score Threshold.

Confidence Score	Threshold Criteria
Low	This dictionary counts an instance as a violation if the Machine Learning (ML) match score is 50 or more.
Medium	This dictionary counts an instance as a violation if the ML match score is 70 or more.
High	This dictionary counts an instance as a violation if the ML match score is 90 or more.
Close
Identity Card Number (China)

This dictionary detects Resident Identity Card numbers from China.

The popular format for a Resident Identity Card number is an 18-character number, but the last character can either be a digit or the character X (case insensitive).

The following are examples of popular formats:

NNNNNNNNNNNNNNNNNX
NNNNNNNNNNNNNNNNNN

This dictionary uses the Mod 11 Check Digit checksum. This checksum is similar to the Luhn checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the Resident Identity Card number matches a valid range.	

The number formats that can trigger the dictionary are:

36--2331198--00322524X
3607 2719830115027X
3425011992...07064058

A number format like 1404011998vv05055835 does not trigger the dictionary. It contains alphabetical characters.


Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The Resident Identity Card number is in a popular format.
	

The number formats that can trigger the dictionary are:

36072719830115027X
342501199207064058

The number formats that do not trigger the dictionary are:

a36233119800322524X (Starts with a character)
a1404011998vv05055835 (Starts with a character)

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The Resident Identity Card number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, Chinese identity card number.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

36233119800322524X
36072719830115027X
342501199207064058
140401199805055835
Close
Identity Card Number (Hong Kong)

This dictionary detects Hong Kong identity card (HKID) numbers from Hong Kong.

The popular format for an HKID number is 8 or 9 alphanumeric characters without delimiters. It starts with either one or two alphabet letters, followed by 6 random digits, and ends with a checksum character that must be enclosed in parentheses. The checksum character can be either a digit or the letter "A" (case insensitive). For example, P553722(7), MR427885(6), and FK057839(A).

This dictionary uses the Mod 11 Check Digit checksum. This checksum is similar to the Luhn checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	

The dictionary counts an instance as a violation if the HKID number matches a valid range.

HKID is a regex-based dictionary, and is strict in formatting, even in low confidence. No special characters are allowed other than parentheses.

If the parentheses are not balanced, it does not trigger the dictionary. There can be only a single pair of parentheses. Nested parentheses do not trigger the dictionary.

	

The number formats that can trigger the dictionary are:

P553722(7)
P553722(A)

The number formats that do not trigger the dictionary are:

P5537227
P553722-7-
P553722(7
P5537227)
P553722((7))

Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The HKID number is in a popular format.
	

The number format that can trigger the dictionary is P553722(7).

The number format that does not trigger the dictionary is P5537227.


High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The HKID number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, Hong Kong Identity Card, HKIC, HKID, Identity Card, or Hong Kong Permanent Resident ID Card.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

P553722(7)
P553722(A)
Close
Identity Card Number (Malaysia)

This dictionary detects National Identity Card (MyKad) numbers from Malaysia.

The popular format for a MyKad number is a 12-digit number. The first group of numbers is the date of birth (YYMMDD). The second group of numbers (SS) represents the place of birth of the holder: the states (01-13), the federal territories (14-16), or the country of origin (60-85). The last group of numbers (###G) is a serial number in an unidentified pattern which is randomly generated. The last digit (G) is an odd number for a male and an even number for a female.

This dictionary does not use a checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the MyKad number matches a valid range.	

The number formats that can trigger the dictionary are:

13...0125281813
261231129312
170 726145727
@240921167814@
16022--5148988

A number format like 1007192dd33724 does not trigger the dictionary.


Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The MyKad number is in a popular format.
	

The number formats that can trigger the dictionary are:

261231129312
@240921167814@

The number formats that do not trigger the dictionary are:

13...0125281813
170 726145727
16022--5148988
A100719233724A

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The MyKad number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, mykad, Malaysian nric, or mypr.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

261231129312
@240921167814@
100719233724

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

13...0125281813
170 726145727
16022--5148988
Close
Identity Card Number (Thailand)

This dictionary detects National Identity Card numbers from Thailand.

The popular format for a National Identity Card number is a 13-digit string in the format of N-NNNN-NNNNN-NN-N. In the Popular Format Checking process, it checks for 4 delimiters.

This dictionary uses the Luhn variation checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	

The dictionary counts an instance as a violation if the National Identity Card number matches a valid range.

The National Identity Card number can contain only a period, hyphen, or space as delimiters.

	

The number formats that can trigger the dictionary are:

@9082208241537@
1-1964-43062-03-2
5-40 42-291 43-14-9
8161427577191
3-5887-693...20-66-7

A number format like 070ww7389561584 does not trigger the dictionary.


Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The National Identity Card number is in a popular format.
	

The number formats that can trigger the dictionary are:

@9082208241537@
1-1964-43062-03-2
8161427577191

The number formats that do not trigger the dictionary are:

070ww7389561584
5-40 42-291 43-14-9
3-5887-693...20-66-7

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The National Identity Card number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, thailand identity card number, thailand national, date issue, or date expiry.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

@9082208241537@
1-1964-43062-03-2
8161427577191

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

07ss07389561584
5-4042-291cc43-14-9
Close
Illegal Drugs

This dictionary detects content related to illegal drugs. It detects the names of illegal drugs such as Cocaine, Heroin, Ketamine, and so on.

This dictionary does not use a checksum.

You can modify the Confidence Score Threshold. Confidence scores inform the dictionary how high it must raise the bar, or threshold, for identifying violations and triggering them. To learn more, see Configuring the Confidence Score Threshold.

Close
Immigration Document

This dictionary detects immigration documents, like passport renewal forms, I-485, I-856, I-907, etc.

Zscaler supports only the following document types for immigration documents: RTF, PDF, MSG, DOC, DOCX, DOCM, DOTX, DOTM, XLS, XLSX, XLSM, XLTM, PPT, PPTX, PPSX, PPTM, POTM, POTX, and IWORK (pages, numbers, and keynote). To detect sensitive content, this dictionary requires at least 1 KB of extracted content from an immigration document file.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria
Low	This dictionary counts an instance as a violation if the Machine Learning (ML) match score is 50 or more.
Medium	This dictionary counts an instance as a violation if the ML match score is 70 or more.
High	This dictionary counts an instance as a violation if the ML match score is 90 or more.
Close
Individual Taxpayer Registry ID (Brazil)

This dictionary detects Individual Taxpayer Registry ID numbers (CPF) from Brazil. If you use an Exact Data Match (EDM) Index Template to try and detect a CPF number, the format ddd.ddd.ddd-dd does not work because '.' (period) is an EDM delimiter. However, if you include this dictionary in a rule, the format ddd.ddd.ddd-dd is detected.

The popular format for an Individual Taxpayer Registry ID number is different for individuals versus legal persons. For individuals, it is an 11-digit number with the last two numbers being the result of an arithmetic operation from the 9 previous ones. For legal persons, it is a 14-digit string formatted as XX.XXX.XXX/XXXX-XX. The first 8 digits identify the company, the four digits after the slash identify the branch or subsidiary, and the last 2 digits are the result of an arithmetic operation from the previous ones.

This dictionary uses the Mod 11 Check Digit checksum. This checksum is similar to the Luhn checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	

The dictionary counts an instance as a violation if the Individual Taxpayer Registry ID number matches a valid range.

The Individual Taxpayer Registry ID number can contain:

A period, hyphen, or space as delimiters. Multiple periods, hyphens, and spaces are allowed.
An alphabetical boundary.
	

The number formats that can trigger the dictionary are:

088.258.987-38
103.015.819-32

The number formats that do not trigger the dictionary are:

989.786.5232-27
286.648.5a71-80
345.543.66@5-02

Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The Individual Taxpayer Registry ID number is in a popular format.

The Individual Taxpayer Registry number can contain a non-alphanumeric boundary. It cannot be bound by alphabetical characters.

	

The number formats that can trigger the dictionary are:

286.648.571-80
088.258.987-38
@345.543.665-02@
103.015.819-32

A number format like 989.786.523-2--7 does not trigger the dictionary.


High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The Individual Taxpayer Registry ID number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, Natural Persons Register or Registration Number.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

286.648.571-80
088.258.987-38
@345.543.665-02@
103.015.819-32

A number format like 989.786.523-2--7 does not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases.

Close
Insurance Document

This dictionary detects insurance documents, like employee insurance, home insurance, commercial insurance, medical insurance, etc.

Zscaler supports only the following document types for insurance documents: RTF, PDF, MSG, DOC, DOCX, DOCM, DOTX, DOTM, XLS, XLSX, XLSM, XLTM, PPT, PPTX, PPSX, PPTM, POTM, POTX, and IWORK (pages, numbers, and keynote). To detect sensitive content, this dictionary requires at least 1 KB of extracted content from an insurance document file.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria
Low	This dictionary counts an instance as a violation if the Machine Learning (ML) match score is 50 or more.
Medium	This dictionary counts an instance as a violation if the ML match score is 70 or more.
High	This dictionary counts an instance as a violation if the ML match score is 90 or more.
Close
International Bank Account Number (IBAN)

This dictionary allows you to select IBAN dictionaries for one or more of the following countries:

Andorra (AD)
Austria (AT)
Bosnia (BA)
Belgium (BE)
Bulgaria (BG)
Switzerland (CH)
Cyprus (CY)
Czechia (CZ)
Germany (DE)
Denmark (DK)
Estonia (EE)
Spain (ES)
Finland (FI)
Faroe Islands (FO)
France (FR)
United Kingdom (GB)
Gibraltar (GI)
Greenland (GL)
Greece (GR)
Croatia (HR)
Hungary (HU)
Ireland (IE)
Israel (IL)
Iceland (IS)
Italy (IT)
Liechtenstein (LI)
Lithuania (LT)
Luxembourg (LU)
Latvia (LV)
Monaco (MC)
Montenegro (ME)
Malta (MT)
Netherlands (NL)
North Macedonia (MK)
Norway (NO)
Poland (PL)
Portugal (PT)
Romania (RO)
Serbia (RS)
Sweden (SE)
Slovenia (SI)
Slovakia (SK)
San Marino (SM)
Tunisia (TN)
Turkey (TR)

See image.

Close

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria
Medium	This dictionary counts an instance as a violation if any of the selected IBAN numbers are matched.
High	This dictionary counts an instance as a violation if any of the selected IBAN numbers are matched by any of the dictionary’s default or custom high confidence phrases.
Close
Invoice Document

This dictionary detects invoice documents, like Bill of Sale forms, purchase orders, etc.

Zscaler supports only the following document types for invoice documents: RTF, PDF, MSG, DOC, DOCX, DOCM, DOTX, DOTM, XLS, XLSX, XLSM, XLTM, PPT, PPTX, PPSX, PPTM, POTM, POTX, and IWORK (pages, numbers, and keynote). To detect sensitive content, this dictionary requires at least 1 KB of extracted content from a supported invoice document file.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria
Low	This dictionary counts an instance as a violation if the Machine Learning (ML) match score is 50 or more.
Medium	This dictionary counts an instance as a violation if the ML match score is 70 or more.
High	This dictionary counts an instance as a violation if the ML match score is 90 or more.
Close
Last Names (Japan)*

This dictionary detects content related to Last Names from Japan.

This dictionary does not use a checksum.

The following are examples of acceptable formats for Japanese Last Names:

村山
佐久間
平山
五十嵐
佐藤
鈴木

You can also specify an Action to configure how the dictionary evaluates matching names:

Count All: The dictionary counts all matches of the name, including identical names, toward the match count.
Count Unique: The dictionary counts each unique match of the name toward the match count only once, regardless of how many times the name appears.
Close
Legal Document

This dictionary detects legal documents, like living wills, name change certificates, etc.

Zscaler supports only the following document types for legal documents: RTF, PDF, MSG, DOC, DOCX, DOCM, DOTX, DOTM, XLS, XLSX, XLSM, XLTM, PPT, PPTX, PPSX, PPTM, POTM, POTX, and IWORK (pages, numbers, and keynote). To detect sensitive content, this dictionary requires at least 1 KB of extracted content from a legal document file.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria
Low	This dictionary counts an instance as a violation if the Machine Learning (ML) match score is 50 or more.
Medium	This dictionary counts an instance as a violation if the ML match score is 70 or more.
High	This dictionary counts an instance as a violation if the ML match score is 90 or more.
Close
Medical Document

This dictionary detects medical documents, like medical consent forms, HIPAA forms, medical record forms, etc.

Zscaler supports only the following document types for medical documents: RTF, PDF, MSG, DOC, DOCX, DOCM, DOTX, DOTM, XLS, XLSX, XLSM, XLTM, PPT, PPTX, PPSX, PPTM, POTM, POTX, and IWORK (pages, numbers, and keynote). To detect sensitive content, this dictionary requires at least 1 KB of extracted content from a medical document file.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria
Low	This dictionary counts an instance as a violation if the Machine Learning (ML) match score is 50 or more.
Medium	This dictionary counts an instance as a violation if the ML match score is 70 or more.
High	This dictionary counts an instance as a violation if the ML match score is 90 or more.
Close
Medical Imaging

This dictionary detects instances of medical imaging, such as x-rays and scans.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the Confidence Score Threshold.

Confidence Score	Threshold Criteria
Low	This dictionary counts an instance as a violation if the Machine Learning (ML) match score is 50 or more.
Medium	This dictionary counts an instance as a violation if the ML match score is 70 or more.
High	This dictionary counts an instance as a violation if the ML match score is 90 or more.
Close
Medical Information

This dictionary detects content related to medical information. It detects the drug and disease names based on the ICD 10 code.

This dictionary does not use a checksum.

You can modify the Confidence Score Threshold. Confidence scores inform the dictionary how high it must raise the bar, or threshold, for identifying violations and triggering them. To learn more, see Configuring the Confidence Score Threshold.

Close
Medicare Numbers (Australia)

This dictionary detects Medicare numbers from Australia.

The popular format for a Medicare number is an 11-digit number. In the Popular Format Checking process, the Mod 10 checksum is performed and the number has to pass the checksum.

This dictionary uses the Mod 10 checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the Medicare number matches a valid range.	

The number formats that can trigger the dictionary are:

@6014812406@
59...89916...497
39--388984 01

A number format like 24//2877813//2 does not trigger the dictionary.


Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The Medicare number is in a popular format.
	

The number formats that can trigger the dictionary are:

@6014812406@
5989916497
3938898401

A number format like A2428778132B does not trigger the dictionary.


High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The Medicare number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, bank account details, medicare payments, mortgage account, bank payments, information branch, credit card loan, department human services, medicare, or medi care.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

@6014812406@
5989916497
3938898401

A number format like A2428778132B does not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases.

Close
Mexico Unique Population Registration Code

This dictionary detects Mexico Unique Population Registration Code numbers.

This dictionary uses the Mod 11 checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the Mexico Unique Population Registration Code number matches a valid range.	

The number formats that can trigger the dictionary are:

HEGG.560427MVZRRL04
HEGG 560427MVZRRL04
HEGG-560427MVZRRL04
HEGG.- 560427MVZRRL04
HEGG560427 MVZRRL04
HEGG560427.MVZRRL04
HEGG560427-MVZRRL04
HEGG560427 -MVZRRL04
HEGG 560427-MVZRRL04

The number formats that do not trigger the dictionary are:

HEGG560427MVZRRL03 (bad checksum)
HE GG560427MVZRRL04 (unpopular format; doesn't match regex)
HEGG560427MVZRRL 04 (unpopular format; doesn't match regex)
HE GG 560427 MVZRRL 04 (unpopular format; doesn't match regex)

Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The Mexico Unique Population Registration Code number is in a popular format.
	

The number formats that can trigger the dictionary are:

HEGG560427MVZRRL04
hEGG560427MVZRRL04
hegg560427mvzrrl04

A number format like HEGG-560427MVZRRL04 does not trigger the dictionary.


High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The Mexico Unique Population Registration Code number is accompanied by any of the dictionary’s default high confidence phrases. For example, Clave Única de Registro de Población, CURP, clave única, ClaveÚnica#, and clavepersonalIdentidad#.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

HEGG560427MVZRRL04
hEGG560427MVZRRL04
hegg560427mvzrrl04

A number format like HEGG-560427MVZRRL04 does not trigger the dictionary.

Close
Mexico Business Tax ID (BRFC)

This dictionary detects the Mexico Registro Federal de Contribuyentes (RFC) for Businesses.

The popular format is 12-digit without delimiters. For example, ABC010203XYZ.

This dictionary does not use a checksum.

The acceptable format (XXXYYYYYYZZZ), where 'x' are letters, 'y' are numbers, and 'z' are alphanumeric characters and is derived as follows:

XXX = First three letters of the company name.
YY = Last two numbers of the year of incorporation.
YY = Two numbers of the month of incorporation.
YY = Two numbers of the day of incorporation.
ZZZ = Alphanumeric digits randomly assigned.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Medium	The dictionary counts an instance as a violation if the Mexico Business Tax ID (RFC) is in a popular format.	

A number format like XYZ221029B8a can trigger the dictionary.

The number formats that do not trigger the dictionary are:

XYZ-22-10-29-B8a
XYZ.221029.B8a
X Y Z 22 10 29 B8a
XY221029B8a
XYZ221035B8a

High	

This dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The Mexico Business Tax ID (RFC) is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, RFC, Registro Federal de Contribuyentes, Tax Identification Number, Mexico, or TIN.
	

A number format like XYZ221029B8a can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases.

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

XYZ-22-10-29-B8a
XYZ.221029.B8a
X Y Z 22 10 29 B8a
Close
Mexico Individual Tax ID (IRFC)

This dictionary detects the Mexico Registro Federal de Contribuyentes (RFC) for Individuals.

The popular format is 13-digit without delimiters.

This dictionary does not use a checksum.

The acceptable format (XXXXYYYYYYZZZ), where 'x' are letters, 'y' are numbers, and 'z' are alphanumeric characters and is derived as follows:

X = First letter of the first surname.
X = First vowel of the first surname.
X = First letter of the second surname.
X = First letter of the first name.
YY = Last two numbers of the year of birth.
YY = Two numbers of the month of birth.
YY = Two numbers of the day of birth.
ZZZ = Alphanumeric digits randomly assigned.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Medium	The dictionary counts an instance as a violation if the Mexico Individual Tax ID (RFC) is in a popular format.	

A number format like CARI920514A31 can trigger the dictionary.

The number formats that do not trigger the dictionary are:

CARI-92-05-14-A31
CARI.920514.A31
C R I A 92 05 14 A31
CXRI920514A31
CARI921314A31

High	

This dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The Mexico Individual Tax ID (RFC) is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, RFC, Registro Federal de Contribuyentes, Tax Identification Number, Mexico, or TIN.
	

A number format like CARI920514A31 can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases.

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

CARI-92-05-14-A31
CARI.920514.A31
C R I A 92 05 14 A31
Close
Mexico Social Security Number (NSS)

Mexico's equivalent to a U.S. Social Security Number is the Número de Seguridad Social (NSS).

This is an 11-digit number issued by the Mexican Social Security Institute (IMSS) that is used for accessing social security benefits like healthcare and pensions for those who work in Mexico.

This dictionary uses the Modulo 10 checksum. This checksum is similar to the Luhn checksum.

The popular format is 11-digits (no delimiter) or 11-digits delimited by a hyphen.

The following are examples of popular formats:

12345678901
12-34-56-7890-1

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	

The dictionary counts an instance as a violation if:

The Mexico National Social Security number (NSS) is in a popular format.
The Mexico National Social Security number (NSS) can be validated by Luhn checksum.
	

The number formats that can trigger the dictionary are:

12 34 56 7890 7
12.34.56.7890..7
12 -34 .56 7890...-7

A number format like 12345678908 does not trigger the dictionary.


Medium	

This dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The Mexico National Social Security number (NSS) is in a popular format.
	

The number formats that can trigger the dictionary are:

12345678907
12-34-56-7890-7

The number formats that do not trigger the dictionary are:

12 34 56 7890 7
12.34.56.7890..7
12 -34 .56 7890...-7

High	

This dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The Mexico National Social Security number (NSS) is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, NSS, Numero de Seguridad Social, Social Security Number, Mexico, or SSN.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

12345678907
12-34-56-7890-7

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

12 34 56 7890 7
12.34.56.7890..7
12 -34 .56 7890...-7
Close
My Number (Japan)

This dictionary detects My Numbers (also referred to as Individual Numbers) from Japan. The popular format for a My Number (Japan) instance is NNNN-NNNN-NNNN or N(12).

This dictionary uses the Mod 11-2 checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the My Number occurrence is 12 digits with a valid checksum and does not match any popular format.	

The number formats that can trigger the dictionary are:

67 56 16 14 81 73
6756-1614.8173
675616148173

A number format like 6756 1614 8174 does not trigger the dictionary.


Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The My Number instance is in a popular format.
	

The number formats that can trigger the dictionary are:

6756 1614 8173
675616148173

The number formats that do not trigger the dictionary are:

6756-1614.8173
67 56 16 14 81 73

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The My Number instance is accompanied by any of the dictionary’s default high confidence phrases. For example, individual number or mynumber.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

6756 1614 8173
675616148173

A number format like 67 56 16 14 81 73 does not trigger the dictionary.

Close
National Document ID (Uruguay)*

This dictionary detects content related to Uruguay-issued Document ID numbers.

The popular format for a Uruguay-issued Document ID number is a 7- or 8-character ID formatted as NNNNNN-C, NNNNNNN-C, or N.NNN.NNN-C, where N is a number (0 to 9) and C is the verification digit.

This dictionary uses the MOD 10 checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	

The dictionary counts an instance as a violation if the Document ID number matches a valid range.

The Document ID number can contain periods or hyphens as delimiters. Multiple periods and hyphens are allowed.

	

The number formats that can trigger the dictionary are:

2449848
23876157
244984-8
2.387.615-7
2387615-7

Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The Document ID number is in a popular format.
	

The number formats that can trigger the dictionary are:

244984-8
2.387.615-7
2387615-7

The number formats that do not trigger the dictionary are:

8123476
1.234.567
2.387.615-7

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The Document ID number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, Numero de CedulaI Documento de Identidad or Cedula de Identidad Uruguaya.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

Numero de CedulaI Documento de Identidad 244984-8
Numero de CedulaI Documento de Identidad 2.387.615-7
Cedula de Identidad Uruguaya 2387615-7

The number formats that do not trigger the dictionary are:

244984-8
2.387.615-7
2387615-7
Close
Names (Canada)

This dictionary detects content related to names from Canada.

This dictionary does not use a checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria
Low	The dictionary counts an instance as a violation if the content contains either a first name or a last name that is in the dictionary.
Medium	The dictionary counts an instance as a violation if the content contains a first name and last name that is in the dictionary.

You can also specify an Action to configure how the dictionary evaluates matching names:

Count All: The dictionary counts all matches of the name, including identical names, toward the match count.
Count Unique: The dictionary counts each unique match of the name toward the match count only once, regardless of how many times the name appears.
Close
Names (Spain)

This dictionary detects content related to names from Spain.

This dictionary does not use a checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria
Low	The dictionary counts an instance as a violation if the content contains either a first name or a last name that is in the dictionary.
Medium	The dictionary counts an instance as a violation if the content contains a first name and last name that is in the dictionary.

You can also specify an Action to configure how the dictionary evaluates matching names:

Count All: The dictionary counts all matches of the name, including identical names, toward the match count.
Count Unique: The dictionary counts each unique match of the name toward the match count only once, regardless of how many times the name appears.
Close
Names (US)

This dictionary detects content related to names from the United States. It detects first and last names.

This dictionary does not use a checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria
Low	The dictionary counts an instance as a violation if the content contains either a first name or a last name that is in the dictionary.
Medium	The dictionary counts an instance as a violation if the content contains a first name and last name that is in the dictionary.

You can also specify an Action to configure how the dictionary evaluates matching names:

Count All: The dictionary counts all matches of the name, including identical names, toward the match count.
Count Unique: The dictionary counts each unique match of the name toward the match count only once, regardless of how many times the name appears.
Close
National Economic Registry Number (Poland)

This dictionary detects the 9- or 14-digit Polish National Economic Registry Number (REGON) number.

This dictionary uses the Mod 11 checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the REGON number matches a valid range.	

The number formats that can trigger the dictionary are:

13 3456783
13345678 3
13 345678-3
13 345678312340
13 34567831234-0
13 4567831234 /-0

A number format like 133456788 does not trigger the dictionary (bad checksum).


Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The REGON number is in a popular format.
	

The number formats that can trigger the dictionary are:

133456783
13 345678 3
13345678312340
13/34567831234/0

The number formats that do not trigger the dictionary are:

13 3456783
13345678 3
13 345678-3
13 345678312340
13 34567831234-0
13 4567831234 /-0

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The REGON number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, regon.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

133456783
13 345678 3
13345678312340
13/34567831234/0

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

13 3456783
13345678 3
13 345678-3
13 345678312340
13 34567831234-0
13 4567831234 /-0
Close
National Health Index Number (New Zealand)

This dictionary detects New Zealand National Health Index Numbers (NZNHIN).

NZNHINs have two formats, both of which are undelimited with no special characters in between:

Old format: AAANNNC
New format: AAANNAC

The old format uses Modulo 11 checksum; the new format uses the Modulo 24 checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the NZNHIN number matches a valid range.	

A number format like WLD-9413 can trigger the dictionary.

The number formats that do not trigger the dictionary are:

WL-D9413 (doesn't match regex)
WLD9-413 (doesn't match regex)
WLD94-13 (doesn't match regex)

Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The NZNHIN number is in a popular format.
	

The number formats that can trigger the dictionary are:

WLD9413
aDh48zj

A number format like WLD-9413 does not trigger the dictionary.


High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The NZNHIN number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, National Health Index Number, National Health Index Num, NHI number, or NHI#.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

WLD9413
aDh48zj

A number format like WLD-9413 does not trigger the dictionary.

Close
National Health Service Number (UK)

This dictionary detects National Health Service (NHS) numbers from the United Kingdom.

The popular format for an NHS number is a 10-digit number formatted as NNN <delimiter>NNN<delimiter>NNNN. The delimiters can be a period, hyphen, or space.

This dictionary uses the Mod 11 Check Digit checksum. This checksum is similar to the Luhn checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	

The dictionary counts an instance as a violation if the NHS number matches a valid range.

The NHS number can contain:

A period, hyphen, or space as delimiters. Multiple periods, hyphens, and spaces are allowed.
An non-alphanumeric boundary.
	

The number formats that can trigger the dictionary are:

566 8018326
5431043544
808619--0226
5878649888
130323...3851

Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The NHS number is in a popular format.

The NHS number can contain a non-alphanumeric boundary. It cannot be bound by alphabetical characters.

The NHS number must use the same delimiters for the full number.

	

The number formats that can trigger the dictionary are:

@5878649888@
1303233851

The number formats that do not trigger the dictionary are:

5@668018326
543!1043!544
A8086190226A

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The NHS number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, NHS Number or National Health Services Number.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

5668018326
5431043544
A8086190226A
@5878649888@
1303233851
Close
National Identification Card Number (Taiwan)

This dictionary detects National Identification Card numbers from Taiwan.

The popular format for a National Identification Card number is a 10-digit string that contains one letter and 9 digits. It can also contain a period, hyphen, or space as delimiters.

This dictionary uses the Luhn checksum but the leading alphabet letter gets converted to a numerical equivalent.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	

The dictionary counts an instance as a violation if the National Identification Card number matches a valid range.

The National Identification Card number can contain a period, hyphen, or space as delimiters. Multiple periods, hyphens, and spaces are allowed.

The National Identification Card number can not contain a delimiter between the first alphabet letter and the next number.

	

The number formats that can trigger the dictionary are:

D146. 665-645
--I145639659
!!F172388317VV
Z258578175DD

The number formats that do not trigger the dictionary are:

Z...222063149
!!X14234881733

Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The National Identification Card number is in a popular format.

The National Identification Card number can only have a non-alphanumeric character for the end delimiter.

	

The number formats that can trigger the dictionary are:

I145639659
!!X142348817@@
Z258578175

The number formats that do not trigger the dictionary are:

Z...222063149
F172388317VV

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The National Identification Card number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, taiwanese national identification card number.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

I145639659
Z222063149
!!X142348817@@
Z258578175

A number format like F172388317VV does not trigger the dictionary if accompanied by any of the dictionary's default or custom high confidence phrases.

Close
National Identification Number (Chile)*

This dictionary detects National Identity Card (RUN) numbers from Chile.

The popular format for a RUN number is an 8- or 9-digit number following the format NNNNNNN-C, NNNNNNNN-C, N.NNN.NNN-C, or NN.NNN.NNN-C, where N is a number (0 to 9) and C is a checksum of a number (0 to 9) or a letter (A to K).

The dictionary uses the Mod 11 checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	

The dictionary counts an instance as a violation if the RUN number matches a valid range.

The RUN number can contain periods or hyphens as delimiters. Multiple periods and hyphens are allowed.

	

The number formats that can trigger the dictionary are:

12.345.678-9
17.317.684-8

The number formats that do not trigger the dictionary are:

6141076
6.141.076

Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The RUN number is in a popular format.
	

The number formats that can trigger the dictionary are:

2211011-K
6.141.076-7
6141076-7

12.450.547-K

The number formats that do not trigger the dictionary are:

61410767
17.317.684-8

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The RUN number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, RUN, Rol Unico Nacional, RUT, or Rol Unico Tributario.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

RUN 6.141.076-7
RUT 17.317.684-8
Rol Unico Tributario 12.450.547-k

The number formats that do not trigger the dictionary are:

12.345.678
123456789-K
Close
National Identification Number (France)

This dictionary detects National Institute of Statistics and Economic Studies (INSEE) numbers from France.

The popular format for an INSEE number is a 15-digit number with the first 13 digits and last 2 digits separated by a space.

This dictionary uses the Mod by 97 checksum. The last two digits are check digits.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	

The dictionary counts an instance as a violation if the INSEE number matches a valid range.

The INSEE number can contain:

A period, hyphen, or space as delimiters. Multiple periods, hyphens, and spaces are allowed.
An alphabetical boundary.
	

The number formats that can trigger the dictionary are:

@113103115324014@
127...1139450--100 58
#23--0036713141980#

Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The INSEE number is in a popular format.

The INSEE number can contain:

A non-alphanumeric boundary.
Only one space between N(13) and N(2).

The INSEE number can not contain a period or a hyphen as a delimiter.

	

The number formats that can trigger the dictionary are:

2430966952225 59
1160568707959 73
%1271139450100 58$
#2300367131419 80#

The number formats that do not trigger the dictionary are:

A138057773213587c
113103115324014

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The INSEE number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, insee, national id, national identification, social security number, social security code, and social insurance number.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

2430966952225 59
1160568707959 73
Close
National Identification Number (Poland)

This dictionary detects National Identification (PESEL) numbers from Poland.

The popular format for a PESEL number is an 11-digit number. The PESEL number has the form of YYMMDDZZZXQ, where YYMMDD is the date of birth (with century encoded in month field), ZZZX is the personal identification number where X codes the sex (even number for females and odd number for males), and Q is a check digit which is used to verify whether a given PESEL is correct or not.

This dictionary uses the Luhn checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the PESEL number matches a valid range.	

The number formats that can trigger the dictionary are:

.14.1017...04491
-82-12270--5195-
971 0050 7364

The number formats that do not trigger the dictionary are:

2302130d3028
(55111304237)

Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The PESEL number is in a popular format.
	

The number formats that can trigger the dictionary are:

97100507364
@23021303028$

The number formats that do not trigger the dictionary are:

.14.1017...04491
-82-12270--5195-
A55111304237G

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The PESEL number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, pesel liczba or peselliczba.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

14101704491
82122705195
97100507364
@23021303028$
55111304237
Close
National Identification Number (Spain)

This dictionary detects National Identity Card numbers (DNI) from Spain.

The popular format for a National Identity Card number is a 9-character number with 8 digits and one letter for security.

This dictionary uses the Mod by 23 checksum. This checksum is similar to the Luhn checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	

The dictionary counts an instance as a violation if the National Identity Card number matches a valid range.

The National Identity Card number can contain:

A period, hyphen, or space as delimiters. Multiple periods, hyphens, and spaces are allowed.
An alphanumeric character as a lead boundary.
	

The number formats that can trigger the dictionary are:

20---222624N
a22369319W

The number formats that do not trigger the dictionary are:

0 1311947@G
33052840-T

Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The National Identity Card number is in a popular format.

The National Identity Card number can contain an alphabetical character as an ending boundary.

The National Identity Card number can not have a delimiter between the last alphabet character and the number.

	

The number formats that can trigger the dictionary are:

01311947G
20222624N
33052840T

A number format like a22369319W does not trigger the dictionary.


High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The National Identity Card number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, national identification number, national identity number, insurance number, personal identification number, national identity, personal identity no, or unique identity number.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

20222624N
22369319W
33052840T

A number format like d01311947G does not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases.

Close
National Insurance Number (UK)

This dictionary detects National Insurance Numbers (NINO) from the United Kingdom.

The popular format for a NINO is a 9-character number. The format of the number is two prefix letters, 6 digits, and one suffix letter. Either of the first two prefix letters cannot be D, F, I, Q, U, or V. The second letter cannot also be O. The prefixes BG, GB, NK, KN, TN, NT, and ZZ are not allocated.

This dictionary does not use a checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the NINO matches a valid range.	

The number formats that can trigger the dictionary are:

AA-123456.C
@#AA876589C@
BB...123456...D

A number format like RR65------3456 does not trigger the dictionary.


Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The NINO is in a popular format.
	

The number formats that can trigger the dictionary are:

AA123456C
AA876589C

The number formats that do not trigger the dictionary are:

BB123456...D
AA-127456.G

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The NINO is accompanied by any of the dictionary’s default high confidence phrases. For example, national insurance number or national insurance.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

AA123465C
RK765432C

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

rh123456U
AA56432D
Close
National Provider Identifier

This dictionary detects National Provider Identifier (NPI) numbers from the United States.

This dictionary uses the Luhn checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the NPI number matches a valid range.	

The number formats that can trigger the dictionary are:

123 456 7893
12.345-6789 3
1 -23/ .456 78...- 9 3

A number format like 1234567894 does not trigger the dictionary (bad checksum).


Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The NPI number is in a popular format.
	

A number format like 1234567893 can trigger the dictionary.

The number formats that do not trigger the dictionary are:

123 456 7893
12.345-6789 3
1 -23/ .456 78...- 9 3

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The NPI number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, national provider identifier number, national provider identifier, and npi.
	

A number format like 1234567893 can trigger the dictionary.

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

123 456 7893
12.345-6789 3
1 -23/ .456 78...- 9 3
Close
NDC Number (Package)

This dictionary detects content related to National Drug Code (NDC) package codes.

This dictionary does not use a checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if it matches a key in the hash table.	

The number formats that can trigger the dictionary are:

0002080001
0990-925739
10014001-08
99528---606--45

The number formats that do not trigger the dictionary are:

000-20800-01 (first hyphen at wrong position)
0990-925-739 (second hyphen at wrong position)
0002-08-00-01 (too many non-adjacent hyphens)
99528---6-06--45 (too many non-adjacent hyphens)

Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The NDC package code is in a popular format.
	

The number formats that can trigger the dictionary are:

0002-0800-01
10014-001-08
86157-0014-1

The number formats that do not trigger the dictionary are:

0002080001
0990-925739
10014001-08
99528---606--45

You can also specify an Action to configure how the dictionary evaluates matching package codes:

Count All: The dictionary counts all matches of the package code, including identical codes, toward the match count.
Count Unique: The dictionary counts each unique match of the package code toward the match count only once, regardless of how many times the code appears.
Close
NDC Number (Product)

This dictionary detects content related to National Drug Code (NDC) product codes.

This dictionary does not use a checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if it matches a key in the hash table.	

The number formats that can trigger the dictionary are:

00020800
0990--9257

The number formats that do not trigger the dictionary are:

000-20800 (hyphen at wrong position)
00020-800 (hyphen at wrong position)
0990-925-7 (too many non-adjacent hyphens)

Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The NDC package code is in a popular format.
	

The number formats that can trigger the dictionary are:

0002-0800
10014-001
86157-0014

The number formats that do not trigger the dictionary are:

00020800
0990--9257

You can also specify an Action to configure how the dictionary evaluates matching product code:

Count All: The dictionary counts all matches of the product code, including identical codes, toward the match count.
Count Unique: The dictionary counts each unique match of the product code toward the match count only once, regardless of how many times the code appears.
Close
NRIC Numbers (Singapore)

This dictionary detects National Registration Identity Card Numbers (UIN and FIN) from Singapore.

The popular format for a National Registration Identity Card number is a 9-character number that includes 7 digits, with the first character being either S, T, F, or G, and the last character is a checksum calculated with respect to the first letter and the 7 digits.

This dictionary uses the Mod 11 Check Digit checksum. This checksum is similar to the Luhn checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	

The dictionary counts an instance as a violation if the National Registration Identity Card number matches a valid range.

The National Identity Card number can contain a period, hyphen, or space as delimiters. Multiple periods, hyphens, and spaces are allowed.

	

The number formats that can trigger the dictionary are:

T156--2546A
G545...8130R
aS8879619Ed

The number formats that do not trigger the dictionary are:

F2d397111U
T0v75 8616C

Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The National Registration Identity Card number is in a popular format.

The National Registration Identity Card number can not contain any delimiters.

The boundary check is not performed for the National Registration Identity Card number as both the start and end have a character.

	

The number formats that can trigger the dictionary are:

T1562546A
G5458130R
aS8879619Ed

The number formats that do not trigger the dictionary are:

F2d397111U
T0v758616C

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The National Registration Identity Card number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, nric, national registration identity card, guin, fin, passport number, or birth certificate.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

T1562546A
G5458130R
F2397111U
T0758616C
aS8879619Ed
Close
Passport Number (Asia)

This dictionary allows you to select passport number dictionaries for one or more of the following countries:

China (CN)
Japan (JP)
South Korea (KR)
Malaysia (MY)
Philippines (PH)
Singapore (SG)
Taiwan (TW)
Turkey (TR)

See image.

Close

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria
Medium	This dictionary counts an instance as a violation if any of the selected passport numbers are matched.
High	This dictionary counts an instance as a violation if any of the selected passport numbers are matched by any of the dictionary’s default or custom high confidence phrases.
Close
Passport Number (European Union)

This dictionary allows you to select passport number dictionaries for one or more European Union countries.

See image.

Close

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria
Medium	This dictionary counts an instance as a violation if the selected country's passport number is matched.
High	The requirements of Medium Confidence are met and the passport number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, Passport, Passport number, passport#.
Close
Personal Identification Number (Croatia)

This dictionary detects Personal Identification Number (Croatia) numbers.

The popular format for a Croatian Personal Identification Number (PIN) is a 11- or a 13-digit number beginning with HR and followed by 11 numbers with no delimiters.

The following are examples of popular formats:

NNNNNNNNNNN
HRNNNNNNNNNNN
hrNNNNNNNNNNN

This dictionary uses the ISO/IEC 7064, Mod 11,10 checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the PIN (Croatia) number matches a valid range.	

The number formats that can trigger the dictionary are:

hr 94577403194
hr.- 12345678911
HR..9942692209 6

The number formats that do not trigger the dictionary are:

HR69435151531 (bad checksum)
H R69435151538 (unpopular format; doesn't match regex)
HR69435 151538 (unpopular format; doesn't match regex)
8684 9310 961 (unpopular format; doesn't match regex)

Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The PIN (Croatia) number is in a popular format.
	

The number formats that can trigger the dictionary are:

HR69435151531
HR 69435151531
24631579813

The number formats that do not trigger the dictionary are:

94 577 403194
hr.-12345678911
HR69435 151538
hr.- 12345678911

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The PIN (Croatia) number is accompanied by any of the dictionary’s default high confidence phrases. For example, OIB, Osobni identifikacijski broj, and Personal identification number.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

HR69435151531
HR 69435151531
24631579813

The number formats that do not trigger the dictionary are:

94 577 403194
hr.-12345678911
HR69435 151538
hr.- 12345678911
Close
Real Estate Document

This dictionary detects real estate documents, like personal or commercial lease agreements, property buying or selling agreements, etc.

Zscaler supports only the following document types for real estate documents: RTF, PDF, MSG, DOC, DOCX, DOCM, DOTX, DOTM, XLS, XLSX, XLSM, XLTM, PPT, PPTX, PPSX, PPTM, POTM, POTX, and IWORK (pages, numbers, and keynote). To detect sensitive content, this dictionary requires at least 1 KB of extracted content from a real estate document file.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria
Low	This dictionary counts an instance as a violation if the Machine Learning (ML) match score is 50 or more.
Medium	This dictionary counts an instance as a violation if the ML match score is 70 or more.
High	This dictionary counts an instance as a violation if the ML match score is 90 or more.
Close
Resident Registration Number (Korea)

This dictionary detects Resident Registration Numbers (RRN) from South Korea.

The popular format for an RRN is a 13-digit number with each digit providing specific information.

This dictionary uses the Luhn variation checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	

The dictionary counts an instance as a violation if the RNN matches a valid range.

The RNN can contain:

A period, hyphen, or space as delimiters. Multiple periods are allowed.
An alphabetical boundary.
	

The number formats that can trigger the dictionary are:

9 70403-2966211
780220-1296377
#840...719-2145299@
D921009-5664079D

A number format like 720590-2208919 does not trigger the dictionary because it fails the popular format check.


Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The RRN is in a popular format.

The RRN can contain:

A non-alphanumeric boundary.
Only a hyphen as a delimiter.
	

The number formats that can trigger the dictionary are:

970403-2966211
!780220-1296377@

The number formats that do not trigger the dictionary are:

720590-2208919
#840...719-2145299@
D921009-5664079D

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The RNN is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, korean resident registration number.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

970403-2966211
!780220-1296377@
890320-1104929
840719-2145299
921009-5664079
940219-5027845
Close
Resume Document

This dictionary detects resume documents.

Zscaler supports only the following document types for resume documents: RTF, PDF, MSG, DOC, DOCX, DOCM, DOTX, DOTM, XLS, XLSX, XLSM, XLTM, PPT, PPTX, PPSX, PPTM, POTM, POTX, and IWORK (pages, numbers, and keynote). To detect sensitive content, this dictionary requires at least 1 KB of extracted content from a resume document file.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria
Low	This dictionary counts an instance as a violation if the Machine Learning (ML) match score is 50 or more.
Medium	This dictionary counts an instance as a violation if the ML match score is 70 or more.
High	This dictionary counts an instance as a violation if the ML match score is 90 or more.
Close
Salesforce.com Data

This dictionary detects content related to Salesforce.com data. It detects keywords that are embedded in a Saleforce report, such as Copyright and Saleforce.com.

This dictionary does not use a checksum.

You can modify the Confidence Score Threshold. Confidence scores inform the dictionary how high it must raise the bar, or threshold, for identifying violations and triggering them. To learn more, see Configuring the Confidence Score Threshold.

Close
Satellite Data

This dictionary detects images that contain satellite data.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the Confidence Score Threshold.

Confidence Score	Threshold Criteria
Low	This dictionary counts an instance as a violation if the Machine Learning (ML) match score is 50 or more.
Medium	This dictionary counts an instance as a violation if the ML match score is 70 or more.
High	This dictionary counts an instance as a violation if the ML match score is 90 or more.
Close
Schematic Data

This dictionary detects images of schematic data, such as blueprints.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the Confidence Score Threshold.

Confidence Score	Threshold Criteria
Low	This dictionary counts an instance as a violation if the Machine Learning (ML) match score is 50 or more.
Medium	This dictionary counts an instance as a violation if the ML match score is 70 or more.
High	This dictionary counts an instance as a violation if the ML match score is 90 or more.
Close
Self-Harm & Cyberbullying

The Self-Harm and Cyberbulling dictionary is intended for use by K-12 educators. If you’re an educator, contact your Zscaler Account team to enable this dictionary.

This dictionary detects when students use public search engines to search for self-harm-related content, or when they post bullying-related content on social media.

You can modify the Confidence Score Threshold. Confidence scores inform the dictionary how high it must raise the bar, or threshold, for identifying violations and triggering them. To learn more, see Configuring the Confidence Score Threshold.

Close
Social Insurance Numbers (Canada)

This dictionary detects Social Insurance Numbers (SIN) from Canada.

The popular format for an SIN is a 9-digit number, separated at the 3rd and 6th digits by a delimiter. The delimiter can be a period, hyphen, or space.

The following are examples of popular formats:

NNNNNNNNN
NNN-NNN-NNN

This dictionary uses the Luhn checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	

The dictionary counts an instance as a violation if the SIN matches a valid range.

The SIN can contain only a period, hyphen, or space as delimiters. Multiple periods, hyphens, and spaces are allowed.

	

The number formats that can trigger the dictionary are:

CC036964 310CC
@054120 373$
@620301 192%
AA021574 728

A number format like 650------72...aa...7266 does not trigger the dictionary.


Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The SIN is in a popular format.

The SIN can contain delimiters only after the 3rd and 6th digits. The delimiters must be the same character. It cannot contain different delimiters.

The SIN can have a boundary but the characters immediately before and after the SIN cannot be alphanumeric.

	

The number formats that can trigger the dictionary are:

054120373
650-727-266

The number formats that do not trigger the dictionary are:

@620 301 192
AA021574 728
650-72.7266

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The SIN is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, social insurance number or national identification number.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

036 964 310
054120373
@620 301 192
650-72.7266
369 893 144

A number format like AA021574 728 does not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases.

Close
Social Security Number (Austria)

This dictionary detects Social Security numbers (ATSSN) from Austria.

This dictionary uses the Modulo 11 checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the ATSSN number matches a valid range.	

The number formats that can trigger the dictionary are:

123 701 0180
1237--010180
1 -23/.701 -. 0 ... -180

A number format like 1238010180 does not trigger the dictionary (bad checksum).


Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The ATSSN number is in a popular format.
	

The number formats that can trigger the dictionary are:

1237010180
1237 010180

The number formats that do not trigger the dictionary are:

123 701 0180
1237--010180
1 -23/.701 -. 0 ... -180

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The ATSSN number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, sozialversicherungsnummer, Austria SSN, soziale sicherheit kein, sozialversicherungsnummer#, and sozialesicherheitkein#.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

1237010180
1237 010180

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

123 701 0180
1237--010180
1 -23/.701 -. 0 ... -180
Close
Social Security Number (Spain)

This dictionary detects social security numbers from Spain.

You can modify the Confidence Score Threshold:

Low: The dictionary counts an instance as a violation if it matches a valid range.
Medium: The dictionary counts an instance as a violation if:
The requirements of Low Confidence are met.
The social security number is in a popular format.
High: The dictionary counts an instance as a violation if:
The requirements of Medium Confidence are met.
The social security number is accompanied by any of the dictionary’s default or custom high confidence phrases.
Close
Social Security Number (Switzerland)

This dictionary detects social security numbers (AHV) from Switzerland.

The popular format for an AHV number is a 13-digit number. The AHV number has the form of 756.XXXX.XXXX.XY, where 756 is the ISO 3166-1 code for Switzerland, XXXX.XXXX.X is a random number, and Y is an EAN-13 check digit.

This dictionary uses the Luhn variation checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the AHV number matches a valid range.	

The number formats that can trigger the dictionary are:

756.52--30.6913.27
756.88 85.8748.24
756.3594.2833.18
@7.56.7811.8967.63@

A number format like 756.2...487.40cc93.09 does not trigger the dictionary.


Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The AHV number is in a popular format.
	

The number formats that can trigger the dictionary are:

756.3594.2833.18
756.2487.4093.09
@7.56.7811.8967.63@

The number formats that do not trigger the dictionary are:

756.52--30.6913.27
756.88 85.8748.24

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The AHV number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, identifiant national, insurance number, national identifier, national insurance number, AHV number, AHV-Nummer, Personenidentifikationsnummer, Schweizer Registrierungsnummer, Swiss registration number, or AVS.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

756.3594.2833.18
@7.56.7811.8967.63@

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

756.52--30.6913.27
756.88 85.8748.24
A756.2487.4093.09A
Close
Social Security Numbers (US)

This dictionary detects Social Security Numbers (SSN) from the United States.

When you add the Social Security Numbers (US) dictionary to a DLP engine, you must configure the match count. To learn more, see Configuring the Match Count.

See image.

Close

The popular format for an SSN is a 9-digit number. It can contain periods, hyphens, or spaces as delimiters.

The following are examples of popular formats:

NNNNNNNNN
NNN-NN-NNNN
NNN.NN.NNNN
NNN NN NNNN

This dictionary does not use a checksum.

You can also specify whether to include or exclude specific SSNs. You can configure up to 512 SSNs to include or exclude. To learn more, see Editing Predefined DLP Dictionaries.

To use this dictionary to detect SSNs, the following guidelines apply:

These guidelines might not apply to certain use cases. You can adjust your dictionary configurations according to your DLP needs.

To catch a small exfiltration of numbers in documents:
Set a Confidence Score Threshold of High for the dictionary.
When adding a dictionary to an engine, set a low value for the dictionary's match count.
To catch a large exfiltration of numbers in spreadsheets or other file types:
Set a Confidence Score Threshold of Medium for the dictionary.
When adding a dictionary to an engine, set a high value for the dictionary’s match count.
In general, configuring a dictionary with a Low Confidence Score Threshold and a low match count value results in too many false positives. Zscaler recommends setting a Confidence Score Threshold of High when its match count value is low.
Rich Text Format (RTF) files contain formatting code that can mimic credit card and social security numbers, affecting when a DLP rule is triggered. Plain text files do not contain this formatting code, therefore the DLP rule triggers as expected. So that the DLP policy triggers if confidential numbers are leaked in RTF files, do one of the following steps:
Set any value greater than 1 for the dictionary’s match count in the engine.
Set a Confidence Score Threshold value of High.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	

The dictionary counts an instance as a violation if:

The SSN is issued regardless of formatting. You can confirm that the group number is within the range issued for a given area at https://www.ssa.gov/employer/ssnweb.htm.
The SSN matches a valid range.
	

The number formats that can trigger the dictionary are:

SA_332831997@@##
SA408456050@
15...21----587---44
---23527 1165
...688781663...

Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The SSN number is in a popular format.
	

The number formats that can trigger the dictionary are:

SA_332831997@@
SA@408456050@
...688781663...
??292108209//
269865658

The number formats that do not trigger the dictionary are:

15...21----587---44
---23527 1165

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The SSN is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, date of birth, social security number, or tax payer.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

SA_332831997@@
408456050
292108209//
269865658

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

15...21----587---44
---23527 1165

If a violation is enough to trigger a DLP policy and you have configured a DLP email notification, your auditors receive an email. If you have also included the ${DLPTRIGGERS} macro, the email includes what content triggered the violation.

Close
Source Code

This dictionary detects content related to source code. It detects typical source code and programming phrases such as class implements, class extends, and private void.

This dictionary does not trigger unless the data size of the detected content is at least 1 KB.

This dictionary does not use a checksum.

You can modify the Confidence Score Threshold. Confidence scores inform the dictionary how high it must raise the bar, or threshold, for identifying violations and triggering them. To learn more, see Configuring the Confidence Score Threshold.

Close
Standardized Bank Code (Mexico)

This dictionary detects Standardized Bank Code numbers (CLABE) from Mexico.

The popular format for a Standardized Bank Code number is an 18-character number. The Standardized Bank Code number has the following structure:

3 digits: Bank Code
3 digits: Brach Office Code
11 digits: Account Number
1 digit: Control Digit

This dictionary uses the Luhn variation checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	

The dictionary counts an instance as a violation if the Standardized Bank Code number matches a valid range.

The Standardized Bank Code number can contain:

A period, hyphen, or space as delimiters. Multiple periods are allowed.
An alphabetical boundary.
	

The number formats that can trigger the dictionary are:

014027000005555558
00201007--777777-7771

A number format like 032180aaa000118359719 does not trigger the dictionary.


Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The Standardized Bank Code number is in a popular format.

The Standardized Bank Code number must contain a non-alphanumeric boundary. The starting delimiter and ending delimiter can not be an alphabet.

	

The number formats that can trigger the dictionary are:

014027000005555558
002010077777777771

A number format like A032180aaa000118359719S does not trigger the dictionary.


High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The Standardized Bank Code number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, CLABE, CLABE interbancaria, or standardized bank code.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

014027000005555558
002010077777777771

A number format like @032180aaa000118359719A does not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases.

Close
Tax Document

This dictionary detects tax documents, such as 1040 forms, 1099 forms, 1998-T forms, 3921 forms, etc.

Zscaler supports only the following document types for tax documents: RTF, PDF, MSG, DOC, DOCX, DOCM, DOTX, DOTM, XLS, XLSX, XLSM, XLTM, PPT, PPTX, PPSX, PPTM, POTM, POTX, and IWORK (pages, numbers, and keynote). To detect sensitive content, this dictionary requires at least 1 KB of extracted content from a tax document file.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria
Low	This dictionary counts an instance as a violation if the Machine Learning (ML) match score is 50 or more.
Medium	This dictionary counts an instance as a violation if the ML match score is 70 or more.
High	This dictionary counts an instance as a violation if the ML match score is 90 or more.
Close
Tax File Numbers (Australia)

This dictionary detects Tax File Numbers (TFN) from Australia. The TFN is issued by the Australian Taxation Office (ATO) to each taxpaying entity such as an individual, company, superannuation fund, partnership, or trust.

The popular format for a TFN is a unique 8-digit or 9-digit number.

This dictionary uses the Mod 11 Check Digit checksum. This checksum is similar to the Luhn checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	

The dictionary counts an instance as a violation if the TFN matches a valid range.

The TFN can contain a period, hyphen, or space as delimiters.

	

The number formats that can trigger the dictionary are:

371 186 29
459 - 599- .-230
112.474-082
565051603
85655805'
'123456782

A number format like 23456782 does not trigger the dictionary.


Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The TFN is in a popular format.
	

The number formats that can trigger the dictionary are:

371 186 29d
459599230
565051603*
'123456782

The number formats that do not trigger the dictionary are:

112.474-082
D85655805D

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The TFN is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, australian business number, marginal tax rate, medicare levy, portfolio number, service veterans, withholding tax, individual tax return, or tax file number.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

371 186 29d
459599230
565051603*
'123456782

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

112.474-082
D85655805D
Close
Tax Identification Number (Austria)

This dictionary detects Austrian Tax Identification Numbers (ATTIN), which are 9-digit unique identifiers issued by the Directorate-General Taxation and Customs Union (DG TAXUD) to all taxpaying individuals of a member state.

This dictionary uses the Luhn checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the number matches a valid range.	

The number formats that can trigger the dictionary are:

93-173-6581
93/173/6581
93--173/6581

A number format like 931736582 does not trigger the dictionary because it uses an invalid checksum.


Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The number is in a popular format.
	

The number formats that can trigger the dictionary are:

931736581
93-173/6581

The number formats that do not trigger the dictionary are:

93-173-6581
93/173/6581
93--173/6581

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The ATTIN is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, österreich, Steuernummer, TIN.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

931736581
93-173/6581

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

93-173-6581
93/173/6581
93--173/6581
Close
Tax Identification Number (Belgium)

This dictionary detects Belgian Tax Identification Numbers (BTIN), which are 11-digit unique identifiers issued by the Directorate-General Taxation and Customs Union (DG TAXUD) to all taxpaying individuals of a member state.

This dictionary uses the Mod 97 checksum, which is similar to the Luhn checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the BTIN matches a valid range.	

The number formats that can trigger the dictionary are:

00.0125-111.19
00.01.2511.1.48
0001251111-9

The number formats that do not trigger the dictionary are:

00.01.25-111.18 (invalid checksum)
00.67.25-111.48 (invalid month)

Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The BTIN is in a popular format.
	

The number formats that can trigger the dictionary are:

00.01.25-111.19
00012511119

The number formats that do not trigger the dictionary are:

00.0125-111.19
00.01.2511.1.48
0001251111-9

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The BTIN is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, belasting aantal, numéro d'identification fiscale, bnn#.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

00.01.25-111.19
00012511119

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

00.0125-111.19
00.01.2511.1.48
0001251111-9
Close
Tax Identification Number (Denmark)

This dictionary detects Danish Tax Identification Numbers (DTIN), which are 10-digit unique identifiers issued by the Directorate-General Taxation and Customs Union (DG TAXUD) to all taxpaying individuals of a member state.

This dictionary uses the Mod 11 checksum, which is similar to the Luhn checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the DTIN number matches a valid range.	

The number formats that can trigger the dictionary are:

010-111-1113
01016011-11

A number format like 010111-1116 does not trigger the dictionary.


Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The DTIN number is in a popular format.
	

The number formats that can trigger the dictionary are:

010111-1113
0101601111

The number formats that do not trigger the dictionary are:

010-111-1113
01016011-11

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The DTIN is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, centrale personregister, civilt registreringssystem, cpr, cpr#, gesundheitskarte nummer, gesundheitsversicherungkarte nummer, TIN, TAX ID, skat id, skattenummer, skat identifikationsnummer, and skat kode.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

010-111-1113
01016011-11

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

010111-1113
0101601111
Close
Tax Identification Number (Finland)

This dictionary detects Finland Tax Identification Numbers (FITIN), which are 10-digit unique identifiers issued by the Directorate-General Taxation and Customs Union (DG TAXUD) to all taxpaying individuals of a member state.

This dictionary uses the Modulo 31 checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the FITIN number matches a valid range.	

The number formats that can trigger the dictionary are:

13 1052-308T
1310 52-308T
13 10 52-308T

The number formats that do not trigger the dictionary are:

131052-308U (bad checksum)
131352-3087 (invalid birth month)
321052-3082 (invalid birth date)

Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The FITIN number is in a popular format.
	

The number formats that can trigger the dictionary are:

131052-308T
131052+308T
131052a308T
131052A308T

The number formats that do not trigger the dictionary are:

13 1052-308T
1310 52-308T
13 10 52-308T

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The FITIN is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, Tunnus Kod, tunnistenumero, tunnus numero, tunnusluku, tunnusnumero, and TIN.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

131052-308T
131052+308T
131052a308T
131052A308T

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

13 1052-308T
1310 52-308T
13 10 52-308T
Close
Tax Identification Number (France)

This dictionary detects French Tax Identification Numbers (FRTIN), which are 13-digit unique identifiers issued by the Directorate-General Taxation and Customs Union (DG TAXUD) to all taxpaying individuals of a member state.

This dictionary uses the Mod 511 checksum, which is similar to the Luhn checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the FRTIN number matches a valid range.	

The number formats that can trigger the dictionary are:

3 023 217 600 053
30--23-217-600-053
30 23-217.600/053

A number format like 3 023 217 600 054 does not trigger the dictionary.


Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The FRTIN number is in a popular format.
	

The number formats that can trigger the dictionary are:

3023217600053
30 23 217 600 053
30-23-217-600-053
30.23.217.600.053
30/23/217/600/053

The number formats that do not trigger the dictionary are:

3 023 217 600 053
30--23-217-600-053
30 23-217.600/053

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The FRTIN is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, tax identification number and numéro SPI.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

30 23 217 600 053
30-23-217-600-053
30.23.217.600.053
30/23/217/600/053

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

3 023 217 600 053
30--23-217-600-053
30 23-217.600/053
Close
Tax Identification Number (Germany)

This dictionary detects German Tax Identification Numbers (GTIN), which are 11-digit unique identifiers issued by the Directorate-General Taxation and Customs Union (DG TAXUD) to all taxpaying individuals of a member state.

This dictionary uses the Mod 11 checksum, which is similar to the Luhn checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the GTIN matches a valid range.	

The number formats that can trigger the dictionary are:

65929 970 489
86-095742-719

A number format like 65 929 970 480 does not trigger the dictionary.


Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The GTIN is in a popular format.
	

The number formats that can trigger the dictionary are:

65 929 970 489
65929970489

The number formats that do not trigger the dictionary are:

65929 970 489
86-095742-719

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The GTIN is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, identifikationsnummer, steueridentifikationsnummer, and steuernummer.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

3023217600053
30 23 217 600 053
30-23-217-600-053
30.23.217.600.053
30/23/217/600/053

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

3 023 217 600 053
30--23-217-600-053
30 23-217.600/053
Close
Tax Identification Number (Greece)

This dictionary detects Greek Tax Identification numbers (GRTIN).

This dictionary uses a variation of the Modulo 11 checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the GRTIN number matches a valid range.	

The number formats that can trigger the dictionary are:

19 86 02 355
19 86-02355
19 8602355

A number format like 198602356 does not trigger the dictionary (bad checksum).


Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The GRTIN number is in a popular format.
	

A number format like 198602355 can trigger the dictionary.

The number formats that do not trigger the dictionary are:

19 86 02 355
19 86-02355
19 8602355

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The GRTIN number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, afm, afm#, tax identification number, and tin.
	

A number format like 198602355 can trigger the dictionary.

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

19 86 02 355
19 86-02355
19 8602355
Close
Tax Identification Number (Hungary)

This dictionary detects Hungarian Tax Identification Numbers (HUTIN), which are 10-digit unique identifiers issued by the Directorate-General Taxation and Customs Union (DG TAXUD) to all taxpaying individuals of a member state.

This dictionary uses the Mod 97 checksum, which is similar to the Luhn checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the HUTIN matches a valid range.	

The number formats that can trigger the dictionary are:

80 71 592 153
807159215 3
8 071592153

A number format like 8071592154 does not trigger the dictionary.


Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The HUTIN is in a popular format.
	

A number format like 8071592153 triggers the dictionary.

The number formats that do not trigger the dictionary are:

80 71 592 153
807159215 3
8 071592153

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The HUTIN is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, adószám and adóazonosító szám.
	

A number format like 8071592153 triggers the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases.

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

80 71 592 153
807159215 3
8 071592153
Close
Tax Identification Number (Indonesia)

This dictionary detects Tax Identification numbers (NPWP) from Indonesia.

The popular format for a Tax Identification number is a 15-digit number. The Tax Identification number has the following structure:

The first 9 digits (1-9) are the unique identity of the taxpayer.
The next 3 digits (10-12) are the code for the tax office where the taxpayer registered for the first time.
The last 3 digits (13-15) are the code for central or branch status.

This dictionary uses the Luhn variation checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria
Low	The dictionary counts an instance as a violation if the Tax Identification number matches a valid range.
Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The Tax Identification number is in a popular format.

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The Tax Identification number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, npwp, indonesia tax number, and indonesian tax number.
Close
Tax Identification Number (Ireland)

This dictionary detects Irish Tax Identification Numbers (IETIN), which are 8- or 9-character unique identifiers issued by the Department of Social Protection. The IETIN is also used by the Revenue Commissioners to identify taxpayers.

This dictionary uses the Modulo 23 checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the IETIN matches a valid range.	

The number formats that can trigger the dictionary are:

1234567 T
1234567 TW

The number formats that do not trigger the dictionary are:

1234567Y (bad checksum)
123456-7TW (doesn't match regex)

Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The IETIN is in a popular format.
	

A number format like 1234567T triggers the dictionary.

The number formats that do not trigger the dictionary are:

1234567 T
1234567 TW

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The IETIN is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, Personal Public Service Number, PPS num, Tax Identification Number, TIN, pps number, ppsn, ppsno, uimhir phearsanta seirbhíse poiblí, pps uimh, and Uimhir aitheantais phearsanta.
	

A number format like 1234567T triggers the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases.

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

1234567 T
1234567 TW
Close
Tax Identification Number (Luxembourg)

This dictionary detects Luxembourg Tax Identification Numbers (LUTIN), which are 11- or 13-digit unique identifiers issued by the Directorate-General Taxation and Customs Union (DG TAXUD) to all taxpaying individuals of a member state.

This dictionary uses the Luhn and Mod 11 checksums.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the LUTIN matches a valid range.	

The number formats that can trigger the dictionary are:

189 312 010 5732
1 893120105732
189312010573 2
81 738 480 120
81 738 480.120
81 -738/ .4 80...-120

The number formats that do not trigger the dictionary are:

1893120105732
61432208511 (bad checksum)

Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The LUTIN is in a popular format.
	

The number formats that can trigger the dictionary are:

1893120105732
81.738.480.120
81-738-480-120
81738480120

The number formats that do not trigger the dictionary are:

189 312 010 5732
1 893120105732
189312010573 2
81 738 480 120
81 738 480.120
81 -738/ .4 80...-120
81 738 480.120

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The LUTIN is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, sécurité sociale, zinn nummer, carte sécurité sociale, étain, numéro d'étain, étain non, Numéro d'identification fiscal luxembourgeois, tin, zinn, Luxembourg Tax Identifikatiounsnummer, and steier.
	

The number formats that trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

1893120105732
81.738.480.120
81-738-480-120
81738480120

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

189 312 010 5732
1 893120105732
189312010573 2
81 738 480 120
81 738 480.120
81 -738/ .4 80...-120
81 738 480.120
Close
Tax Identification Number (New Zealand)

This dictionary detects New Zealand Tax Identification Numbers (NZTIN), which are 8- or 9-digit unique identifiers issued by the Inland Revenue Department (IRD).

This dictionary uses the Mod 11 algorithm for validation.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the NZTIN matches a valid range.	

The number formats that can trigger the dictionary are:

136-410132
136-4-10-132
49091 850

A number format like 136-410-134 does not trigger the dictionary.


Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The NZTIN is in a popular format.
	

The number formats that can trigger the dictionary are:

49 091 850
136410132
136-410-132

The number formats that do not trigger the dictionary are:

136-410132
136-4-10-132
49091 850

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The NZTIN is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, IRD Number and Inland Revenue Department.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

49 091 850
136410132
136-410-132

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

136-410132
136-4-10-132
49091 850
Close
Tax Identification Number (Peru)

This dictionary detects Tax Identification numbers (PERUC) from Peru.

This dictionary uses a variation of the Modulo 11 checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the PERUC number matches a valid range.	

The number formats that can trigger the dictionary are:

20 503644-968
20--503644-968
2 -05/ .036 449...- 68

A number format like 20503644969 does not trigger the dictionary (bad checksum).


Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The PERUC number is in a popular format.
	

The number formats that can trigger the dictionary are:

20503644968
20 503644 968

The number formats that do not trigger the dictionary are:

20 503644-968
20--503644-968
2 -05/ .036 449...- 68

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The PERUC number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, Registro Unico Contribuyentes, tax identification number, peru tax identification number, peruvian tax identification number, peru tin, and peruvian tin.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

20503644968
20 503644 968

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

20 503644-968
20--503644-968
2 -05/ .036 449...- 68
Close
Tax Identification Number (Poland)

This dictionary detects Tax Identification numbers (PLTIN) from Poland, which are 10- or 11-digit unique identifiers issued by the Directorate-General Taxation and Customs Union (DG TAXUD) to all taxpaying individuals of a Member State.

This dictionary uses the Modulo 11 checksum for the 10-digit number, and the Luhn checksum for the 11-digit number.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the PLTIN number matches a valid range.	

The number formats that can trigger the dictionary are:

2234 567895
0207080 3628

A number format like 2234567894 does not trigger the dictionary (bad checksum).


Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The PLTIN number is in a popular format.
	

The number formats that can trigger the dictionary are:

2234567895
02070803628

The number formats that do not trigger the dictionary are:

2234 567895
0207080 3628

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The PLTIN number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, nip, nip#, numer identyfikacji podatkowej, numeridentyfikacjipodatkowej, tax identification number, tax number, and tin.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

2234567895
02070803628

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

2234 567895
0207080 3628
Close
Tax Identification Number (Portugal)

This dictionary detects Portuguese Tax Identification Numbers (PTIN), which are 9-digit unique identifiers issued by the Directorate-General Taxation and Customs Union (DG TAXUD) to all taxpaying individuals of a member state.

This dictionary uses the Mod 11 algorithm for validation.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the PTIN number matches a valid range.	

The number formats that can trigger the dictionary are:

299 999998
2544964.40
2544.96350

A number format like 299999991 does not trigger the dictionary.


Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The PTIN number is in a popular format.
	

A number format like 299999998 triggers the dictionary.

The number formats that do not trigger the dictionary are:

640130.3331
640823 3234
640 8233234

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The PTIN is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, cpf#, cpf, nif#, nif, numero fiscal, and tin.
	

A number format like 299999998 triggers the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases.

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

640130.3331
640823 3234
640 8233234
Close
Tax Identification Number (Spain)

This dictionary detects Tax Identification numbers (CIF) from Spain.

This dictionary uses the Luhn checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the CIF number matches a valid range.	

A number format like A58818501 can trigger the dictionary.

The number formats that do not trigger the dictionary are:

A 58818501
A588 18501
A588185-01
A58818502 (bad checksum)

Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The CIF number is in a popular format.
	

A number format like A58818501 can trigger the dictionary.

The number formats that do not trigger the dictionary are:

A 58818501
A588 18501
A588185-01

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The CIF number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, tax identification code, Código identificación fiscal, CIF, and CIF número.
	

A number format like A58818501 can trigger the dictionary.

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

A 58818501
A588 18501
A588185-01
Close
Tax Identification Number (Sweden)

This dictionary detects Swedish Tax Identification Numbers (STIN), which are 10-digit unique identifiers issued by the Directorate-General Taxation and Customs Union (DG TAXUD) to all taxpaying individuals of a member state.

This dictionary uses the Luhn checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the STIN matches a valid range.	

The number formats that can trigger the dictionary are:

640130.3331
640823 3234
640 8233234

A number format like 640823-3235 does not trigger the dictionary.


Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The STIN is in a popular format.
	

The number formats that can trigger the dictionary are:

640130-3331
6408233234

The number formats that do not trigger the dictionary are:

640130.3331
640823 3234
640 8233234

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The STIN is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, personnummer, skatt identifikation, skattebetalarens, identifikationsnummer, and sverige tin.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

640130-3331
6408233234

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

640130.3331
640823 3234
640 8233234
Close
Tax Identification Number (US)

This dictionary detects Tax Identification numbers (USITIN) from the United States.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the USITIN number matches a valid range.	

The number formats that can trigger the dictionary are:

927 70-5828
927 70 5828
927 70 58 28

A number format like 827705828 does not trigger the dictionary (first digit must be a 9).


Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The USITIN number is in a popular format.
	

A number format like 927705828 can trigger the dictionary.

The number formats that do not trigger the dictionary are:

927 70-5828
927 70 5828
927 70 58 28

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The USITIN number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, ITIN, USITIN, tax identification number, and taxpayer identification number.
	

A number format like 927705828 can trigger the dictionary.

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

927 70-5828
927 70 5828
927 70 58 28
Close
Technical Document

This dictionary detects technical documents, like computer user manuals, white papers, technical publications, etc.

Zscaler supports only the following document types for technical documents: RTF, PDF, MSG, DOC, DOCX, DOCM, DOTX, DOTM, XLS, XLSX, XLSM, XLTM, PPT, PPTX, PPSX, PPTM, POTM, POTX, and IWORK (pages, numbers, and keynote). To detect sensitive content, this dictionary requires at least 1 KB of extracted content from a technical document file.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria
Low	This dictionary counts an instance as a violation if the Machine Learning (ML) match score is 50 or more.
Medium	This dictionary counts an instance as a violation if the ML match score is 70 or more.
High	This dictionary counts an instance as a violation if the ML match score is 90 or more.
Close
Transportation and Motor Department Document

This dictionary detects transportation and motor department documents, like sale or transfer of a vehicle, license forms, driving records, etc.

Zscaler supports only the following document types for transportation and motor department documents: RTF, PDF, MSG, DOC, DOCX, DOCM, DOTX, DOTM, XLS, XLSX, XLSM, XLTM, PPT, PPTX, PPSX, PPTM, POTM, POTX, and IWORK (pages, numbers, and keynote). To detect sensitive content, this dictionary requires at least 1 KB of extracted content from a transportation and motor department document file.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria
Low	This dictionary counts an instance as a violation if the Machine Learning (ML) match score is 50 or more.
Medium	This dictionary counts an instance as a violation if the ML match score is 70 or more.
High	This dictionary counts an instance as a violation if the ML match score is 90 or more.
Close
Treatments Information

This dictionary uses phrase matching to detect content related to treatments information. It does not use a checksum.

You can specify an Action to configure how the dictionary evaluates matching treatment names:

Count All: The dictionary counts all matches of the treatment name, including identical treatment names, toward the match count.
Count Unique: The dictionary counts each unique match of the treatment name toward the match count only once, regardless of how many times the treatment name appears.
Close
Unique Identification Code (Peru)*

This dictionary detects Unique Identification Code (CUI) numbers from Peru.

The popular format for a CUI number is an 8- or 9-digit number using the format NNNNNNNN, NNNNNNNN-C, or NNNNNNNNC, where N is a number (0 to 9) and C is a checksum of either a number (0 to 9) or the letter K.

This dictionary uses the Mod 11 checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	

The dictionary counts an instance as a violation if the CUI number matches a valid range. The number can be either 8 digits with no checksum or 9 digits with a valid checksum.

The CUI number can contain periods or hyphens as delimiters. Multiple periods and hyphens are allowed.

	

The number formats that can trigger the dictionary are:

42388604
245004601

The number formats that do not trigger the dictionary are:

42388604-21
1234567

Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The CUI number is in a popular format.
The CUI number is either 8 digits with no checksum or 9 digits with a valid checksum.

The CUI number can contain an alphabetical character (A to K) as an ending boundary.

	

The number formats that can trigger the dictionary are:

42388604-3
24500460-1
12345678-K

The number formats that do not trigger the dictionary are:

42388604
12 345 678

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The CUI number is either 8 digits with no checksum or 9 digits with a valid checksum.
The CUI number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, CUI, Codigo Unico Identificacion, DNI, or Documento Nacional de Identidad.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

Documento Nacional de Identidad 42388604-3
CUI 24500460-1

The number formats that do not trigger the dictionary are:

DNI 423-886-04
245004601
123 456 78K
Close
Unique Master Citizen Number

This dictionary detects the 13-digit Unique Master Citizen Number.

This dictionary uses the Mod 11 checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the Unique Master Citizen Number matches a valid range.	

The number formats that can trigger the dictionary are:

0407 9894 04655
04.0798-940 4655
04 -07/ .989 404...-655

A number format like 0407989404651 does not trigger the dictionary (bad checksum).


Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The Unique Master Citizen Number is in a popular format.
	

A number format like 0407989404655 triggers the dictionary.

The number formats that do not trigger the dictionary are:

0407 9894 04655
04.0798-940 4655
04 -07/ .989 404...-655

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The Unique Master Citizen Number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, JMBG, ЈМБГ, ЕМБГ, Jedinstveni matični broj građana, and EMŠO.
	

A number format like 0407989404655 triggers the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases.

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

0407 9894 04655
04.0798-940 4655
04 -07/ .989 404...-655
Close
VAT Number (Austria)

This dictionary detects Austrian value-added tax (VAT) numbers, which are alphanumeric identifiers used to identify taxable persons (business) or non-taxable legal entities.

This dictionary uses a variation of the Mod 10 checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the VAT number matches a valid range.	

The number formats that can trigger the dictionary are:

AT U10223006
AT-U10223006
AT.U10223006
AT -. U10223006

The number formats that do not trigger the dictionary are:

ATU10223007 (invalid checksum)
A TU10223006
ATU 10223006
ATU10 223 00 6

Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The VAT number is in a popular format.
	

The number formats that can trigger the dictionary are:

ATU10223006
AT U10223006

The number formats that do not trigger the dictionary are:

AT U10223006
AT-U10223006
AT.U10223006
AT -. U10223006

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The VAT number is accompanied by phrases such as: Umsatzsteuer-Identifikationsnummer, Ust-Identifikationsnummer, umsatzsteuer, vat number, vat num, and vat.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

ATU10223006
AT U10223006

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

AT U10223006
AT-U10223006
AT.U10223006
AT -. U10223006
Close
VAT Number (Belgium)

This dictionary detects Belgian value-added tax (VAT) numbers, which are alphanumeric identifiers used to identify taxable persons (business) or non-taxable legal entities.

This dictionary uses the Mod 97 checksum, which is similar to the Luhn checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the VAT number matches a valid range.	

The number formats that can trigger the dictionary are:

BE 0776091951
BE-0776091951
BE.0776091951
BE -. 0776091951

The number formats that do not trigger the dictionary are:

BE0776091952 (invalid checksum)
B E0776091951
BE0 776091951
BE077 609 195 1

Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The VAT number is in a popular format.
	

The number formats that can trigger the dictionary are:

BE0776091951
BE 0776091951

The number formats that do not trigger the dictionary are:

BE 0776091951
BE-0776091951
BE.0776091951
BE -. 0776091951

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The VAT number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, vat number and vat num.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

BE0776091951
BE 0776091951

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

BE 0776091951
BE-0776091951
BE.0776091951
BE -. 0776091951
Close
VAT Number (France)

This dictionary detects French value-added tax (VAT) numbers, which are alphanumeric identifiers used to identify taxable persons (business) or non-taxable legal entities.

This dictionary uses the Mod 97 checksum, which is similar to the Luhn checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the VAT number matches a valid range.	

The number formats that can trigger the dictionary are:

FR 00300076965
FR-00300076965
FR.00300076965
FR -. 00300076965

The number formats that do not trigger the dictionary are:

FR00300076964 (invalid checksum)
F R00300076965
FR0 0300076965
FR003 000 769 65

Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The VAT number is in a popular format.
	

The number formats that can trigger the dictionary are:

FR00300076965
FR 00300076965

The number formats that do not trigger the dictionary are:

FR 00300076965
FR-00300076965
FR.00300076965
FR -. 00300076965

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The VAT number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, Numéro TVA intracommunautaire, TVA intracommunautaire, TVA, and vat.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

FR00300076965
FR 00300076965

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

FR 00300076965
FR-00300076965
FR.00300076965
FR -. 00300076965
Close
VAT Number (Germany)

This dictionary detects German value-added tax (VAT) numbers, which are alphanumeric identifiers used to identify taxable persons (business) or non-taxable legal entities.

This dictionary uses a combination of the Mod 10 and Mod 11 checksums.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the VAT number matches a valid range.	

The number formats that can trigger the dictionary are:

DE 111111125
DE-111111125
DE.111111125
DE -. 111111125

The number formats that do not trigger the dictionary are:

D E111111125
DE1 11111125
DE 111 111 125

Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The VAT number is in a popular format.
	

The number formats that can trigger the dictionary are:

DE111111125
DE 111111125

The number formats that do not trigger the dictionary are:

DE 111111125
DE-111111125
DE.111111125
DE -. 111111125

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The VAT number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, mwst, mehrwertsteuer identifikationsnummer, mehrwertsteuer nummer, vat num, and vat#.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

DE111111125
DE 111111125

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

DE 111111125
DE-111111125
DE.111111125
DE -. 111111125
Close
VAT Number (Ireland)

This dictionary detects Irish value-added tax (VAT) numbers, which are alphanumeric identifiers used to identify taxable persons (business) or non-taxable legal entities.

This dictionary uses the Modulo 23 checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the VAT number matches a valid range.	

The number formats that can trigger the dictionary are:

IE 8Z49289F
IE-8Z49289F
IE.8Z49289F
IE -. 8Z49289F

The number formats that do not trigger the dictionary are:

IE8Z49289G (bad checksum)
I E8Z49289F (doesn't match regex)
IE8Z 49289F (doesn't match regex)
IE8-Z4-92-89F (doesn't match regex)

Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The VAT number is in a popular format.
	

The number formats that can trigger the dictionary are:

IE8Z49289F
IE 8Z49289F

The number formats that do not trigger the dictionary are:

IE 8Z49289F
IE-8Z49289F
IE.8Z49289F
IE -. 8Z49289F

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The VAT number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, vat num and vat number.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

IE8Z49289F
IE 8Z49289F

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

IE 8Z49289F
IE-8Z49289F
IE.8Z49289F
IE -. 8Z49289F
Close
VAT Number (Luxembourg)

This dictionary detects Luxembourg value-added tax (VAT) numbers, which are alphanumeric identifiers used to identify taxable persons (business) or non-taxable legal entities.

This dictionary uses the Mod 89 checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the VAT number matches a valid range.	

The number formats that can trigger the dictionary are:

LU 13669580
LU-13669580
LU.13669580
LU -. 13669580

The number formats that do not trigger the dictionary are:

LU13669581 (invalid checksum)
L U13669580
LU1 3669580
LU136 695 80

Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The VAT number is in a popular format.
	

The number formats that can trigger the dictionary are:

LU13669580
LU 13669580

The number formats that do not trigger the dictionary are:

LU 13669580
LU-13669580
LU.13669580
LU -. 13669580

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The VAT number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, tva, vat num, and vat.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

LU13669580
LU 13669580

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

LU 13669580
LU-13669580
LU.13669580
LU -. 13669580
Close
VAT Number (Netherlands)

This dictionary detects Netherlands value-added tax (VAT) numbers, which are alphanumeric identifiers used to identify taxable persons (business) or non-taxable legal entities.

This dictionary uses the Mod 11 checksum, which is similar to the Luhn checksum.

The following table lists the confidence score threshold criteria for this dictionary. You can modify the confidence score threshold.

Confidence Score	Threshold Criteria	Examples of Data
Low	The dictionary counts an instance as a violation if the VAT number matches a valid range.	

The number formats that can trigger the dictionary are:

NL 123456782B01
NL-123456782B01
NL.123456782B01
NL -. 123456782B01

The number formats that do not trigger the dictionary are:

NL123456783B01 (invalid checksum)
N L123456782B01
NL1 23456782B01
NL123 456 78 2B0 1

Medium	

The dictionary counts an instance as a violation if:

The requirements of Low Confidence are met.
The VAT number is in a popular format.
	

The number formats that can trigger the dictionary are:

NL123456782B01
NL 123456782B01

The number formats that do not trigger the dictionary are:

NL 123456782B01
NL-123456782B01
NL.123456782B01
NL -. 123456782B01

High	

The dictionary counts an instance as a violation if:

The requirements of Medium Confidence are met.
The VAT number is accompanied by any of the dictionary’s default or custom high confidence phrases. For example, Btw-nummer, Btw-num, vat num, and vat.
	

The number formats that can trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

NL123456782B01
NL 123456782B01

The number formats that do not trigger the dictionary if accompanied by any of the dictionary’s default or custom high confidence phrases are:

NL 123456782B01
NL-123456782B01
NL.123456782B01
NL -. 123456782B01
Close
Weapons

This dictionary detects content related to weapons. It detects weapons such as firearms and other military weapons.

This dictionary does not use a checksum.

You can modify the Confidence Score Threshold. Confidence scores inform the dictionary how high it must raise the bar, or threshold, for identifying violations and triggering them. To learn more, see Configuring the Confidence Score Threshold.

Close
Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
About DLP Dictionaries
Understanding Predefined DLP Dictionaries
Editing Predefined DLP Dictionaries
Cloning Predefined DLP Dictionaries
Adding Custom DLP Dictionaries
Defining Patterns for Custom DLP Dictionaries
Defining Phrases for Custom DLP Dictionaries
Defining Microsoft Information Protection Labels for Custom DLP Dictionaries
About DLP Engines
Understanding DLP Engines
Editing Predefined DLP Engines
Adding Custom DLP Engines
Cloning DLP Engines
