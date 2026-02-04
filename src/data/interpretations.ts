import type { SignName } from '../types/astrology';

export interface SignInterpretation {
    sign: SignName;
    sun: string;
    moon: string;
    ascendant: string;
}

export const signInterpretations: Record<SignName, SignInterpretation> = {
    Aries: {
        sign: 'Aries',
        sun: 'Your core identity is defined by courage, initiative, and a pioneering spirit. You thrive on challenges and are naturally drawn to leadership roles. Your vitality comes from action and being first.',
        moon: 'Emotionally, you need excitement and independence. You process feelings quickly and prefer direct confrontation over lingering tension. Your instincts are fast and protective.',
        ascendant: 'You present yourself with boldness and directness. First impressions are of someone dynamic, competitive, and unafraid. You approach life head-on with visible enthusiasm.'
    },
    Taurus: {
        sign: 'Taurus',
        sun: 'Your core identity is grounded in stability, sensuality, and determination. You value security and beauty, building lasting foundations through patience and persistence.',
        moon: 'Emotionally, you seek comfort and predictability. You process feelings slowly and steadily, finding security in routines and physical pleasures. Your loyalty runs deep.',
        ascendant: 'You present yourself as calm, reliable, and grounded. First impressions are of someone steady and aesthetically aware. You approach life with deliberate, measured steps.'
    },
    Gemini: {
        sign: 'Gemini',
        sun: 'Your core identity thrives on communication, curiosity, and versatility. You are intellectually driven, constantly seeking new information and connections. Adaptability is your strength.',
        moon: 'Emotionally, you need mental stimulation and variety. You process feelings through talking and analysis, sometimes rationalizing emotions. Your moods shift quickly with new input.',
        ascendant: 'You present yourself as witty, articulate, and curious. First impressions are of someone quick-minded and sociable. You approach life with questions and conversation.'
    },
    Cancer: {
        sign: 'Cancer',
        sun: 'Your core identity is rooted in nurturing, protection, and emotional depth. You are deeply connected to family, home, and the past. Your strength lies in your capacity to care.',
        moon: 'Emotionally, this is your home sign. You feel deeply and intuitively, with powerful connections to memory and ancestry. Emotional security is paramount to your wellbeing.',
        ascendant: 'You present yourself as caring, protective, and approachable. First impressions are of someone nurturing yet guarded. You approach life with sensitivity to others\' needs.'
    },
    Leo: {
        sign: 'Leo',
        sun: 'Your core identity shines with creativity, generosity, and self-expression. You are meant to lead, inspire, and bring warmth to others. Recognition fuels your spirit.',
        moon: 'Emotionally, you need appreciation and creative outlets. You process feelings dramatically and require an audience to fully express yourself. Your heart is big and proud.',
        ascendant: 'You present yourself with confidence, warmth, and flair. First impressions are of someone charismatic and commanding. You approach life as if on a stage, with presence.'
    },
    Virgo: {
        sign: 'Virgo',
        sun: 'Your core identity is defined by analysis, service, and refinement. You find purpose in improvement and helping others. Your keen eye for detail is both gift and challenge.',
        moon: 'Emotionally, you need order and usefulness. You process feelings through analysis and practical action, sometimes over-critiquing yourself. Service brings emotional fulfillment.',
        ascendant: 'You present yourself as modest, helpful, and observant. First impressions are of someone capable and health-conscious. You approach life with discernment and precision.'
    },
    Libra: {
        sign: 'Libra',
        sun: 'Your core identity seeks harmony, partnership, and beauty. You are naturally diplomatic, seeing all sides of any situation. Balance in relationships gives your life meaning.',
        moon: 'Emotionally, you need peace and partnership. You process feelings through others, often requiring a sounding board. Conflict disturbs your inner equilibrium deeply.',
        ascendant: 'You present yourself as charming, fair, and refined. First impressions are of someone graceful and relationship-oriented. You approach life seeking connection and agreement.'
    },
    Scorpio: {
        sign: 'Scorpio',
        sun: 'Your core identity is forged through intensity, transformation, and depth. You dive deep into life\'s mysteries, unafraid of darkness. Your power lies in regeneration.',
        moon: 'Emotionally, you feel with penetrating intensity. You process feelings privately and completely, with strong instincts for hidden truths. Trust is earned, not given.',
        ascendant: 'You present yourself as magnetic, private, and powerful. First impressions are of someone mysterious and perceptive. You approach life with psychological awareness.'
    },
    Sagittarius: {
        sign: 'Sagittarius',
        sun: 'Your core identity expands through philosophy, adventure, and truth-seeking. You are optimistic and restless, forever chasing meaning across horizons. Freedom is essential.',
        moon: 'Emotionally, you need space and meaning. You process feelings through exploration and big-picture thinking, sometimes escaping difficult emotions. Hope sustains you.',
        ascendant: 'You present yourself as enthusiastic, honest, and adventurous. First impressions are of someone optimistic and philosophical. You approach life as a journey of discovery.'
    },
    Capricorn: {
        sign: 'Capricorn',
        sun: 'Your core identity is built on ambition, discipline, and legacy. You are here to achieve and contribute meaningfully to society. Time is your ally as you climb.',
        moon: 'Emotionally, you need structure and achievement. You process feelings with restraint and practicality, sometimes suppressing vulnerability. Maturity comes early.',
        ascendant: 'You present yourself as competent, serious, and ambitious. First impressions are of someone responsible and goal-oriented. You approach life as a mountain to climb.'
    },
    Aquarius: {
        sign: 'Aquarius',
        sun: 'Your core identity is defined by originality, humanitarianism, and vision. You see beyond convention, advocating for collective progress. Your genius lies in innovation.',
        moon: 'Emotionally, you need freedom and intellectual connection. You process feelings with detachment, sometimes rationalizing away deeper emotions. Friendship feeds your soul.',
        ascendant: 'You present yourself as unique, progressive, and independent. First impressions are of someone unconventional and forward-thinking. You approach life as an experiment.'
    },
    Pisces: {
        sign: 'Pisces',
        sun: 'Your core identity dissolves boundaries through compassion, imagination, and spirituality. You are deeply connected to the collective unconscious. Your strength is transcendence.',
        moon: 'Emotionally, you are highly permeable and intuitive. You absorb feelings from your environment like a sponge.Boundaries blur between self and other, dreams and reality.',
        ascendant: 'You present yourself as gentle, dreamy, and compassionate. First impressions are of someone artistic and otherworldly. You approach life through feeling and imagination.'
    }
};


export const houseInterpretations: Record<number, { sun: string; moon: string }> = {
    1: {
        sun: "In the 1st House, the Sun illuminates your self-image and vitality. You are meant to be seen and to lead. Your path involves discovering and expressing your true self boldly.",
        moon: "In the 1st House, your emotions are worn on your sleeve. You react instinctively and personally to your environment. Your mood strongly influences your physical vitality."
    },
    2: {
        sun: "In the 2nd House, the Sun shines on resources and values. You find confidence through stability, possessions, and self-worth. Building something lasting is key to your vitality.",
        moon: "In the 2nd House, emotional security is tied to material stability. You need comfort and familiar surroundings. Financial fluctuations can deeply affect your mood."
    },
    3: {
        sun: "In the 3rd House, the Sun illuminates communication and learning. You shine when exchanging ideas, writing, or connecting with your immediate community. Curiosity is your fuel.",
        moon: "In the 3rd House, you find comfort in communication. You process feelings through words and need mental stimulation to feel secure. Siblings or neighbors may play a key emotional role."
    },
    4: {
        sun: "In the 4th House, the Sun shines on home and family. Your true self is found in your private life and roots. You may be the center of your domestic sphere.",
        moon: "In the 4th House, you are deeply attached to home and privacy. Emotional security depends on a sanctuary where you can retreat. You have strong instincts about family and heritage."
    },
    5: {
        sun: "In the 5th House, the Sun illuminates creativity, romance, and self-expression. You shine when you are creating, performing, or enjoying life's pleasures. You take pride in what you birth.",
        moon: "In the 5th House, you find emotional fulfillment through creative self-expression and play. You nurture others by encouraging their joy. Romance is deeply emotional for you."
    },
    6: {
        sun: "In the 6th House, the Sun shines on service, health, and daily routines. You find purpose in being useful and refining your skills. Proficiency and order give you confidence.",
        moon: "In the 6th House, you find emotional security in routine and helpfulness. Body-mind connection is strong; stress often manifests physically. You care by doing practical things."
    },
    7: {
        sun: "In the 7th House, the Sun illuminates relationships and partnerships. You shine through connection with others. Indentity is often formed or reflected through significant others.",
        moon: "In the 7th House, your emotional well-being is tied to relationships. You need a partner to feel complete and may seek emotional support constantly from others."
    },
    8: {
        sun: "In the 8th House, the Sun shines on transformation and shared resources. You are drawn to life's mysteries and deep psychological truths. You find power in resilience.",
        moon: "In the 8th House, you have intense, deep-seated emotions. You crave profound intimacy but may fear vulnerability. You possess strong intuitive or psychic sensitivity."
    },
    9: {
        sun: "In the 9th House, the Sun illuminates the quest for meaning. You shine through travel, philosophy, and higher learning. Expanding your horizons is essential for your spirit.",
        moon: "In the 9th House, you find emotional security through belief systems or travel. You need to feel that life has a higher purpose. Exploring the unknown feels like home."
    },
    10: {
        sun: "In the 10th House, the Sun shines on career and public reputation. You are ambitious and meant to be visible in the world. Achievement and authority define your path.",
        moon: "In the 10th House, you may feel emotionally exposed to the public. You seek recognition and may treat your career like a family. Your reputation is sensitive to you."
    },
    11: {
        sun: "In the 11th House, the Sun illuminates friendships and future goals. You shine in groups and collective endeavors. You identify with your hopes and your community.",
        moon: "In the 11th House, you feel a strong emotional need for belonging. Friends are like family. You may be emotionally invested in social causes or group dynamics."
    },
    12: {
        sun: "In the 12th House, the Sun shines on the unconscious and spiritual. You may be private or introspective, finding strength in solitude. Your ego dissolves into the collective.",
        moon: "In the 12th House, emotions are often hidden or repressed. You need solitude to recharge. You have deep empathy and may soak up others' feelings effortlessly."
    }
};

type AspectType = 'Conjunction' | 'Opposition' | 'Trine' | 'Square' | 'Sextile';

// Simple key generation helper
const getAspectKey = (p1: string, p2: string, type: AspectType) => {
    // Sort planets alphabetically to ensure consistent keys
    const [a, b] = [p1, p2].sort();
    return `${a}-${b}-${type}`;
};

export const aspectInterpretations: Record<string, string> = {
    // Sun - Moon
    [getAspectKey('Sun', 'Moon', 'Conjunction')]: "Your conscious desires and emotional needs are aligned. You are focused and single-minded, but may lack objectivity about yourself. Your identities are fused.",
    [getAspectKey('Sun', 'Moon', 'Opposition')]: "You often feel pulled between your ego and your emotions. Relationships mirror this internal conflict. Finding balance between head and heart is a lifelong theme.",
    [getAspectKey('Sun', 'Moon', 'Square')]: "There is friction between who you want to be and what you need emotionally. This tension fuels ambition but can lead to internal stress. You learn through challenge.",
    [getAspectKey('Sun', 'Moon', 'Trine')]: "Your inner self and outer expression flow harmoniously. You have a natural confidence and emotional resilience. Life often feels smoother for you.",
    [getAspectKey('Sun', 'Moon', 'Sextile')]: "You have opportunities to blend your will and your feelings constructively. You are generally supportive of your own growth.",

    // Sun - Mars
    [getAspectKey('Sun', 'Mars', 'Conjunction')]: "You are energetic, assertive, and driven. Your will is matched by your action. You may be impatient or impulsive but have great vitality.",
    [getAspectKey('Sun', 'Mars', 'Square')]: "You possess tremendous drive but often face obstacles that test your will. This tension creates a fighter spirit. You must learn to channel anger constructively.",

    // Add more specific aspect interpretations here
};

// Generic Aspect Fallback generator
const generateGenericAspectText = (p1: string, p2: string, type: AspectType): string => {
    switch (type) {
        case 'Conjunction': return `The energies of ${p1} and ${p2} are blended together, intensifying both.`;
        case 'Opposition': return `${p1} and ${p2} are in a tug-of-war, creating awareness through relationship tension.`;
        case 'Square': return `There is dynamic tension between ${p1} and ${p2}, demanding action and resolution.`;
        case 'Trine': return `The energies of ${p1} and ${p2} flow together effortlessly and supportively.`;
        case 'Sextile': return `There is a productive opportunity to combine the energies of ${p1} and ${p2}.`;
        default: return `${p1} interacts with ${p2}.`;
    }
};

export function getInterpretation(sign: SignName, placement: 'sun' | 'moon' | 'ascendant'): string;
export function getInterpretation(house: number, placement: 'sun-house' | 'moon-house'): string;
export function getInterpretation(p1: string, p2: string, type: AspectType): string;
export function getInterpretation(arg1: string | number, arg2: string, arg3?: string): string {
    // Handle Aspect
    if (typeof arg1 === 'string' && typeof arg2 === 'string' && arg3) {
        const type = arg3 as AspectType;
        const key = getAspectKey(arg1, arg2, type);
        if (aspectInterpretations[key]) {
            return aspectInterpretations[key];
        }
        // Return generic if specific not found
        return generateGenericAspectText(arg1, arg2, type);
    }

    // Handle House
    if (typeof arg1 === 'number') {
        const houseData = houseInterpretations[arg1];
        if (!houseData) return 'Interpretation not available.';
        if (arg2 === 'sun-house') return houseData.sun;
        if (arg2 === 'moon-house') return houseData.moon;
    }
    // Handle Sign
    else if (typeof arg1 === 'string') {
        return signInterpretations[arg1 as SignName]?.[arg2 as 'sun' | 'moon' | 'ascendant'] ?? 'Interpretation not available.';
    }

    return 'Interpretation not available.';
}
