import * as Tone from "tone";
interface Square {
  color: string;
  note: string;
  isSelected: boolean;
}
let synth: Tone.PolySynth;
let chord_seq: Tone.Sequence;
let kick: Tone.MembraneSynth;
let snare: Tone.NoiseSynth;
let drum_seq: Tone.Sequence;



// Expects the squares array
// Containing some arrays with selected values and some arrays that are empty
const playSequence = async (squares: Square[][], tempo: number, drumsEnabled: boolean) => {
    await Tone.start();

    let chords = squares.map((prev) => {
        let temp = prev.map((col) => {
            return col.isSelected ? col.note : null;
        })
        .filter((val) => val !== null);
        return temp;
    });

    console.log(chords);

    // stopPlaying();

    if (!synth) synth = new Tone.PolySynth().toDestination();
    /*
        -------------------------
        NOTE: Tone.Sequence will ignore 2D array structure and will 
        basically treat it as a 1D array
        -------------------------
    */

    const beats = chords.map((_, i) => i);
    chord_seq = new Tone.Sequence((time, index) => {
      const chord = chords[index];
      if(chord && chord.length > 0) {
        synth.triggerAttackRelease(chord, "8n", time);
      }
    }, beats, "8n");

    chord_seq.start(
      // Tone.now() + 0.02
      0
    ); // start at beginning of transport timeline
    if(drumsEnabled){
      playDrums();
    }
    Tone.Transport.bpm.value = tempo;
    console.log(Tone.Transport.bpm.value = tempo);

    Tone.Transport.start();
}

const playNote = async (note: string) => {
  await Tone.start();
  if (!synth) synth = new Tone.PolySynth().toDestination();
  synth.triggerAttackRelease(note, 0.3);
};


async function stopPlaying(){
    if (chord_seq) {
      console.log("Destroying the chord sequence");
      chord_seq.stop(Tone.now() + 0.01);
      chord_seq.dispose();
    }
    if (drum_seq) {
      console.log("Destroying the drum sequence");
      drum_seq.stop(Tone.now() + 0.01);
      drum_seq.dispose();
    }
    if (kick) {
      console.log("Destroying the kick");
      kick.dispose();
    }
    if (snare) {
      console.log("Destroying the snare");
      snare.dispose();
    }

    Tone.Transport.stop();
}


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

  //Starts the drum sequence on a slight delay
  drum_seq.start(0);
}

export { playSequence, stopPlaying, playNote };