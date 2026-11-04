# Temporary synthetic voice pack

User requested female and male stand-ins to audition app pacing. Generated with ElevenLabs eleven_v4; no cloning and no host recordings used.

Female: Jessica — Playful, Bright, Warm (`cgSgspJ2msm6clMCkdW9`).
Male: Dylan — Warm, Clear and Conversational (`KxR7w7QY9Rc4gig86VPG`).

26 bundled MP3 files cover game introductions, countdown, reactions, scores, ending and five sample-challenge reveals. Variants 2/3 deliberately reuse the primary take and its exact caption in this prototype. Assets and text mappings live in src/content/demoVoices.ts. Voices play automatically in gameplay; the home screen has no separate audition controls. No API key, live synthesis, or network voice-service request occurs in the shipped preview.

The home screen discloses temporary synthetic voices, and the challenge introduction explains its sample content. Gameplay captions use “YOUR HOSTS” to keep the round flowing. Demo challenge answers remain samples; generated audio does not grant editorial approval or turn them into real host answers. Future host recordings should replace the demo mappings and captions explicitly.

Validated: TypeScript, 27 rules/content tests, browser female/male playback with no console errors and return to Replay, iOS/web export. Physical iPhone audio, exact countdown synchronization and subjective performance quality still need a listening session. No assertion of matching either host's real voice.
