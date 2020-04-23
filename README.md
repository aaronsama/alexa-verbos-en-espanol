# Verbos en Español (Alexa Skill)

An Alexa skill to help you practice Spanish verb conjugations.

This is the source code of [Verbos en Español](https://www.amazon.es/Default-User-Verbos-en-Espa%C3%B1ol/dp/B082L27PMP), in a friendly Github repo.

This is an interactive skill that quizzes you about verb conjugations in Spanish. It currently supports indicativo, subjuntivo, gerundio and participio.

It is based on the database created by Fred Jehle (http://www.ghidinelli.com/free-spanish-conjugated-verb-database).

## Setup instructions

You need to create a `credentials.json` file in `lambda/shared` with a single entry as follows:

```json
{
  "roleArn": "arn:aws:iam::XXXXXXXXX:role/Alexa"
}
```
(get the actual value for your skill)

If you want to use Testflow, you need to create another credential file with IAM in `lambda/test/testflow_credentials.json`.

```json
{
  "accessKeyId": "...",
  "secretAccessKey": "...",
  "region": "..."
}
```
