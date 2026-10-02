const sacred = "https://sacred-texts.com/book/the-master-key-system/shell/";

export const haanelTopics = Object.freeze(["thought", "purpose", "concentration", "action", "inner-power", "habit"]);

const quote = (id, text, part, lesson, topics, reflection, slug) => Object.freeze({
  id, quote: text, source: "The Master Key System", part, lesson, topics: Object.freeze(topics), reflection,
  sourceUrl: `${sacred}${slug}`,
});

export const haanelQuotes = Object.freeze([
  quote("mind-creative", "Mind is creative, and conditions, environment and all experiences in life are the result of our habitual or predominant mental attitude.", "Part One", "Statement 2", ["thought", "habit"], "What mental attitude is most familiar in the way you meet today?", "part-one"),
  quote("method-thinking", "The attitude of mind necessarily depends upon what we think. Therefore, the secret of all power, all achievement and all possession depends upon our method of thinking.", "Part One", "Statement 3", ["thought", "inner-power"], "Which thought deserves more deliberate attention?", "part-one"),
  quote("be-do-think", `We must "be" before we can "do" and we can "do" only to the extent that we "are," and what we "are" depends upon what we "think."`, "Part One", "Statement 4", ["purpose", "action"], "What quality do you want to practise before taking your next action?", "part-one"),
  quote("power-within", "We cannot express powers that we do not possess. The only way by which we may secure possession of power is to become conscious of power, and we can never become conscious of power until we learn that all power is from within.", "Part One", "Statement 5", ["inner-power", "purpose"], "What inner resource can you recognise and use today?", "part-one"),
  quote("world-within", "There is a world within—a world of thought and feeling and power; of light and life and beauty and, although invisible, its forces are mighty.", "Part One", "Statement 6", ["inner-power", "thought"], "What do you notice when you give your inner life a little quiet?", "part-one"),
  quote("control-thoughts", "Harmony in the world within means the ability to control our thoughts, and to determine for ourselves how any experience is to affect us.", "Part One", "Statement 10", ["concentration", "habit"], "How would you like to choose your response to one experience today?", "part-one"),
  quote("thought-cause", "Every thought is therefore a cause, and every condition an effect; for this reason it is absolutely essential that you control your thoughts so as to bring forth only desirable conditions.", "Part One", "Statement 31", ["thought", "action"], "What thought can you redirect towards a constructive next step?", "part-one"),
  quote("exact-principles", "All power is from within, and is absolutely under your control; it comes through exact knowledge and by the voluntary exercises of exact principles.", "Part One", "Statement 32", ["inner-power", "action"], "What principle could you practise rather than merely understand?", "part-one"),
  quote("world-reflection", "The world without is a reflection of the world within.", "Part One", "Questionnaire", ["thought", "purpose"], "What outer situation invites you to look at your inner response?", "part-one"),
  quote("possession-consciousness", "All possession is based on consciousness.", "Part One", "Questionnaire", ["purpose", "inner-power"], "What would you become more aware of in order to move with purpose?", "part-one"),
  quote("mind-action", "Mind in action is thought, and thought is creative.", "Part Five", "Introduction", ["thought", "action"], "What thought could become one useful action today?", "part-five"),
  quote("subconscious-problem", "The subconscious can and will solve any problem for us if we know how to direct it.", "Part Five", "Statement 2", ["concentration", "habit"], "What clear question could you hold gently in mind?", "part-five"),
  quote("visualization", "Visualization is the process of making mental images, and the image is the mould or model which will serve as a pattern from which your future will emerge.", "Part Seven", "Statement 1", ["purpose", "concentration"], "What outcome would you like to picture with greater clarity?", "part-seven"),
  quote("all-thought-creative", "All thought is creative.", "Part Fourteen", "Introduction", ["thought", "action"], "Which thought are you willing to make more intentional?", "part-fourteen"),
  quote("concentrate-condition", "Most persons concentrate intently upon an unsatisfactory condition, thereby giving the condition that measure of energy and vitality which is necessary in order to supply a vigorous growth.", "Part Fourteen", "Introduction", ["concentration", "habit"], "Where is your attention resting, and is that where you want your energy to grow?", "part-fourteen"),
]);
