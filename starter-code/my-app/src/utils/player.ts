import * as Tone from "tone"

let kick: Tone.MembraneSynth;
let snare: Tone.NoiseSynth;
let drum_seq: Tone.Sequence;

const playDrums = () => {
    // if there's an existing drum sequence, stop & dispose it first
    if (drum_seq) {
        drum_seq.stop();
        drum_seq.dispose();
        drum_seq = undefined as unknown as Tone.Sequence;
    }

    kick = new Tone.MembraneSynth().toDestination();
    snare = new Tone.NoiseSynth({
        noise: { type: "white" },
        envelope: { attack: 0.001, decay: 0.2, sustain: 0 }
    }).toDestination();

    // Sequence using Tone.Sequence
    drum_seq = new Tone.Sequence((time, step) => {
        if (step.kick) kick.triggerAttackRelease("C1", "8n", time);
        if (step.snare) snare.triggerAttackRelease("8n", time);
    }, [
        { kick: true, snare: false },
        { kick: false, snare: true },
        { kick: true, snare: false },
        { kick: false, snare: true },
    ], "4n");

    // Starts the drum sequence on a slight delay
    drum_seq.start(0);
}

export {
    playNote,
    playSequence,
    stopPlaying
};