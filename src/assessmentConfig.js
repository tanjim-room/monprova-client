// Assessment Configuration - PHQ-9, GAD-7, PSS-10

export const assessmentTypes = {
    PHQ9: 'PHQ-9',
    GAD7: 'GAD-7',
    PSS10: 'PSS-10'
};

export const assessmentConfig = {
    [assessmentTypes.PHQ9]: {
        id: 'phq9',
        title: 'PHQ-9 (Patient Health Questionnaire-9)',
        subtitle: 'মানসিক বিষণ্নতা মূল্যায়ন',
        description: 'গত দুই সপ্তাহে আপনি কতবার নিম্নলিখিত সমস্যাগুলি দ্বারা বিরক্ত হয়েছেন?',
        duration: '5-10 minutes',
        icon: '😔',
        maxScore: 27,
        severity: {
            0: { label: 'No depression', bangla: 'কোন বিষণ্নতা নেই', color: 'bg-green-100' },
            5: { label: 'Mild', bangla: 'হালকা', color: 'bg-yellow-100' },
            10: { label: 'Moderate', bangla: 'মধ্যম', color: 'bg-orange-100' },
            15: { label: 'Moderately Severe', bangla: 'মধ্যম গুরুতর', color: 'bg-red-100' },
            20: { label: 'Severe', bangla: 'গুরুতর', color: 'bg-red-200' }
        },
        questions: [
            {
                id: 1,
                text: 'আমি অনেক সময় দুঃখিত বোধ করি বা আশাহীন বোধ করি',
                bangla: 'আমি অনেক সময় দুঃখিত বোধ করি বা আশাহীন বোধ করি',
                options: [
                    { value: 0, label: 'কখনও নয়', text: 'Not at all' },
                    { value: 1, label: 'কয়েক দিন', text: 'Several days' },
                    { value: 2, label: 'অর্ধেক দিন বা তার বেশি', text: 'More than half the days' },
                    { value: 3, label: 'প্রায় প্রতিদিন', text: 'Nearly every day' }
                ]
            },
            {
                id: 2,
                text: 'আমি সাধারণত যে কাজগুলি আনন্দদায়ক ছিল তা করতে আগ্রহ হারিয়েছি',
                bangla: 'আমি সাধারণত যে কাজগুলি আনন্দদায়ক ছিল তা করতে আগ্রহ হারিয়েছি',
                options: [
                    { value: 0, label: 'কখনও নয়', text: 'Not at all' },
                    { value: 1, label: 'কয়েক দিন', text: 'Several days' },
                    { value: 2, label: 'অর্ধেক দিন বা তার বেশি', text: 'More than half the days' },
                    { value: 3, label: 'প্রায় প্রতিদিন', text: 'Nearly every day' }
                ]
            },
            {
                id: 3,
                text: 'আমার ঘুমে সমস্যা রয়েছে (ঘুমাতে পারি না বা খুব বেশি ঘুমাই)',
                bangla: 'আমার ঘুমে সমস্যা রয়েছে (ঘুমাতে পারি না বা খুব বেশি ঘুমাই)',
                options: [
                    { value: 0, label: 'কখনও নয়', text: 'Not at all' },
                    { value: 1, label: 'কয়েক দিন', text: 'Several days' },
                    { value: 2, label: 'অর্ধেক দিন বা তার বেশি', text: 'More than half the days' },
                    { value: 3, label: 'প্রায় প্রতিদিন', text: 'Nearly every day' }
                ]
            },
            {
                id: 4,
                text: 'আমি ক্লান্ত বা শক্তিহীন বোধ করি',
                bangla: 'আমি ক্লান্ত বা শক্তিহীন বোধ করি',
                options: [
                    { value: 0, label: 'কখনও নয়', text: 'Not at all' },
                    { value: 1, label: 'কয়েক দিন', text: 'Several days' },
                    { value: 2, label: 'অর্ধেক দিন বা তার বেশি', text: 'More than half the days' },
                    { value: 3, label: 'প্রায় প্রতিদিন', text: 'Nearly every day' }
                ]
            },
            {
                id: 5,
                text: 'আমার ক্ষুধার পরিবর্তন হয়েছে (খুব কম বা খুব বেশি খাই)',
                bangla: 'আমার ক্ষুধার পরিবর্তন হয়েছে (খুব কম বা খুব বেশি খাই)',
                options: [
                    { value: 0, label: 'কখনও নয়', text: 'Not at all' },
                    { value: 1, label: 'কয়েক দিন', text: 'Several days' },
                    { value: 2, label: 'অর্ধেক দিন বা তার বেশি', text: 'More than half the days' },
                    { value: 3, label: 'প্রায় প্রতিদিন', text: 'Nearly every day' }
                ]
            },
            {
                id: 6,
                text: 'আমি খারাপ মনে করি আমার নিজেকে - অথবা আমি একটি ব্যর্থতা অনুভব করি',
                bangla: 'আমি খারাপ মনে করি আমার নিজেকে - অথবা আমি একটি ব্যর্থতা অনুভব করি',
                options: [
                    { value: 0, label: 'কখনও নয়', text: 'Not at all' },
                    { value: 1, label: 'কয়েক দিন', text: 'Several days' },
                    { value: 2, label: 'অর্ধেক দিন বা তার বেশি', text: 'More than half the days' },
                    { value: 3, label: 'প্রায় প্রতিদিন', text: 'Nearly every day' }
                ]
            },
            {
                id: 7,
                text: 'আমার মনোযোগ দিতে বা বিষয়গুলিতে মনোনিবেশ করতে অসুবিধা হয়',
                bangla: 'আমার মনোযোগ দিতে বা বিষয়গুলিতে মনোনিবেশ করতে অসুবিধা হয়',
                options: [
                    { value: 0, label: 'কখনও নয়', text: 'Not at all' },
                    { value: 1, label: 'কয়েক দিন', text: 'Several days' },
                    { value: 2, label: 'অর্ধেক দিন বা তার বেশি', text: 'More than half the days' },
                    { value: 3, label: 'প্রায় প্রতিদিন', text: 'Nearly every day' }
                ]
            },
            {
                id: 8,
                text: 'আমি এতটাই ধীরগতিতে চলি যে অন্যরা লক্ষ্য করেছে অথবা আমি কথায় কথায় দ্রুত কথা বলি',
                bangla: 'আমি এতটাই ধীরগতিতে চলি যে অন্যরা লক্ষ্য করেছে অথবা আমি কথায় কথায় দ্রুত কথা বলি',
                options: [
                    { value: 0, label: 'কখনও নয়', text: 'Not at all' },
                    { value: 1, label: 'কয়েক দিন', text: 'Several days' },
                    { value: 2, label: 'অর্ধেক দিন বা তার বেশি', text: 'More than half the days' },
                    { value: 3, label: 'প্রায় প্রতিদিন', text: 'Nearly every day' }
                ]
            },
            {
                id: 9,
                text: 'আমি নিজেকে আহত করার চিন্তা বা মনে করি যে মরা ভাল হত',
                bangla: 'আমি নিজেকে আহত করার চিন্তা বা মনে করি যে মরা ভাল হত',
                options: [
                    { value: 0, label: 'কখনও নয়', text: 'Not at all' },
                    { value: 1, label: 'কয়েক দিন', text: 'Several days' },
                    { value: 2, label: 'অর্ধেক দিন বা তার বেশি', text: 'More than half the days' },
                    { value: 3, label: 'প্রায় প্রতিদিন', text: 'Nearly every day' }
                ]
            }
        ]
    },
    [assessmentTypes.GAD7]: {
        id: 'gad7',
        title: 'GAD-7 (Generalized Anxiety Disorder-7)',
        subtitle: 'সাধারণ উদ্বেগ ব্যাধি মূল্যায়ন',
        description: 'গত দুই সপ্তাহে আপনি কতবার নিম্নলিখিত সমস্যাগুলি দ্বারা বিরক্ত হয়েছেন?',
        duration: '5-10 minutes',
        icon: '😰',
        maxScore: 21,
        severity: {
            0: { label: 'No anxiety', bangla: 'কোন উদ্বেগ নেই', color: 'bg-green-100' },
            5: { label: 'Mild', bangla: 'হালকা', color: 'bg-yellow-100' },
            10: { label: 'Moderate', bangla: 'মধ্যম', color: 'bg-orange-100' },
            15: { label: 'Severe', bangla: 'গুরুতর', color: 'bg-red-100' }
        },
        questions: [
            {
                id: 1,
                text: 'আমি উদ্বেগী, উদ্বিগ্ন বা উত্সাহী অনুভব করি',
                bangla: 'আমি উদ্বেগী, উদ্বিগ্ন বা উত্সাহী অনুভব করি',
                options: [
                    { value: 0, label: 'কখনও নয়', text: 'Not at all' },
                    { value: 1, label: 'কয়েক দিন', text: 'Several days' },
                    { value: 2, label: 'অর্ধেক দিন বা তার বেশি', text: 'More than half the days' },
                    { value: 3, label: 'প্রায় প্রতিদিন', text: 'Nearly every day' }
                ]
            },
            {
                id: 2,
                text: 'আমি উদ্বেগ নিয়ন্ত্রণ করতে পারি না',
                bangla: 'আমি উদ্বেগ নিয়ন্ত্রণ করতে পারি না',
                options: [
                    { value: 0, label: 'কখনও নয়', text: 'Not at all' },
                    { value: 1, label: 'কয়েক দিন', text: 'Several days' },
                    { value: 2, label: 'অর্ধেক দিন বা তার বেশি', text: 'More than half the days' },
                    { value: 3, label: 'প্রায় প্রতিদিন', text: 'Nearly every day' }
                ]
            },
            {
                id: 3,
                text: 'আমি খুব বেশি জিনিস সম্পর্কে চিন্তা করি',
                bangla: 'আমি খুব বেশি জিনিস সম্পর্কে চিন্তা করি',
                options: [
                    { value: 0, label: 'কখনও নয়', text: 'Not at all' },
                    { value: 1, label: 'কয়েক দিন', text: 'Several days' },
                    { value: 2, label: 'অর্ধেক দিন বা তার বেশি', text: 'More than half the days' },
                    { value: 3, label: 'প্রায় প্রতিদিন', text: 'Nearly every day' }
                ]
            },
            {
                id: 4,
                text: 'আমি শান্ত থাকতে অসুবিধা হয়',
                bangla: 'আমি শান্ত থাকতে অসুবিধা হয়',
                options: [
                    { value: 0, label: 'কখনও নয়', text: 'Not at all' },
                    { value: 1, label: 'কয়েক দিন', text: 'Several days' },
                    { value: 2, label: 'অর্ধেক দিন বা তার বেশি', text: 'More than half the days' },
                    { value: 3, label: 'প্রায় প্রতিদিন', text: 'Nearly every day' }
                ]
            },
            {
                id: 5,
                text: 'আমি এত বিরক্ত বা তৃপ্তিহীন যে এটি কঠিন হয়ে যায়',
                bangla: 'আমি এত বিরক্ত বা তৃপ্তিহীন যে এটি কঠিন হয়ে যায়',
                options: [
                    { value: 0, label: 'কখনও নয়', text: 'Not at all' },
                    { value: 1, label: 'কয়েক দিন', text: 'Several days' },
                    { value: 2, label: 'অর্ধেক দিন বা তার বেশি', text: 'More than half the days' },
                    { value: 3, label: 'প্রায় প্রতিদিন', text: 'Nearly every day' }
                ]
            },
            {
                id: 6,
                text: 'আমি ভয় পাই যে কিছু ভয়ঙ্কর ঘটবে',
                bangla: 'আমি ভয় পাই যে কিছু ভয়ঙ্কর ঘটবে',
                options: [
                    { value: 0, label: 'কখনও নয়', text: 'Not at all' },
                    { value: 1, label: 'কয়েক দিন', text: 'Several days' },
                    { value: 2, label: 'অর্ধেক দিন বা তার বেশি', text: 'More than half the days' },
                    { value: 3, label: 'প্রায় প্রতিদিন', text: 'Nearly every day' }
                ]
            },
            {
                id: 7,
                text: 'আমার শ্বাসকষ্ট হয় বা আমার বুক দ্রুত স্পন্দিত হয়',
                bangla: 'আমার শ্বাসকষ্ট হয় বা আমার বুক দ্রুত স্পন্দিত হয়',
                options: [
                    { value: 0, label: 'কখনও নয়', text: 'Not at all' },
                    { value: 1, label: 'কয়েক দিন', text: 'Several days' },
                    { value: 2, label: 'অর্ধেক দিন বা তার বেশি', text: 'More than half the days' },
                    { value: 3, label: 'প্রায় প্রতিদিন', text: 'Nearly every day' }
                ]
            }
        ]
    },
    [assessmentTypes.PSS10]: {
        id: 'pss10',
        title: 'PSS-10 (Perceived Stress Scale-10)',
        subtitle: 'অনুভূত স্ট্রেস স্কেল',
        description: 'গত এক মাসে, আপনি কতবার নিম্নলিখিত অনুভব করেছেন?',
        duration: '5-10 minutes',
        icon: '😟',
        maxScore: 40,
        severity: {
            0: { label: 'Low stress', bangla: 'কম চাপ', color: 'bg-green-100' },
            13: { label: 'Moderate stress', bangla: 'মধ্যম চাপ', color: 'bg-yellow-100' },
            26: { label: 'High stress', bangla: 'উচ্চ চাপ', color: 'bg-red-100' }
        },
        questions: [
            {
                id: 1,
                text: 'গত মাসে, আপনি কতবার অপ্রত্যাশিত কিছুর কারণে চাপ অনুভব করেছেন?',
                bangla: 'গত মাসে, আপনি কতবার অপ্রত্যাশিত কিছুর কারণে চাপ অনুভব করেছেন?',
                options: [
                    { value: 0, label: 'কখনও', text: 'Never' },
                    { value: 1, label: 'প্রায় কখনও', text: 'Almost never' },
                    { value: 2, label: 'মাঝে মাঝে', text: 'Sometimes' },
                    { value: 3, label: 'বেশ বেশি', text: 'Fairly often' },
                    { value: 4, label: 'খুব বেশি', text: 'Very often' }
                ]
            },
            {
                id: 2,
                text: 'আপনি আপনার জীবন পরিচালনা করতে অক্ষম বোধ করেছেন?',
                bangla: 'আপনি আপনার জীবন পরিচালনা করতে অক্ষম বোধ করেছেন?',
                options: [
                    { value: 0, label: 'কখনও', text: 'Never' },
                    { value: 1, label: 'প্রায় কখনও', text: 'Almost never' },
                    { value: 2, label: 'মাঝে মাঝে', text: 'Sometimes' },
                    { value: 3, label: 'বেশ বেশি', text: 'Fairly often' },
                    { value: 4, label: 'খুব বেশি', text: 'Very often' }
                ]
            },
            {
                id: 3,
                text: 'আপনি নার্ভাস এবং স্ট্রেস করেছেন?',
                bangla: 'আপনি নার্ভাস এবং স্ট্রেস করেছেন?',
                options: [
                    { value: 0, label: 'কখনও', text: 'Never' },
                    { value: 1, label: 'প্রায় কখনও', text: 'Almost never' },
                    { value: 2, label: 'মাঝে মাঝে', text: 'Sometimes' },
                    { value: 3, label: 'বেশ বেশি', text: 'Fairly often' },
                    { value: 4, label: 'খুব বেশি', text: 'Very often' }
                ]
            },
            {
                id: 4,
                text: 'আপনি আত্মবিশ্বাস বোধ করেছেন আপনার ক্ষমতা কিছু করার?',
                bangla: 'আপনি আত্মবিশ্বাস বোধ করেছেন আপনার ক্ষমতা কিছু করার?',
                options: [
                    { value: 4, label: 'কখনও', text: 'Never' },
                    { value: 3, label: 'প্রায় কখনও', text: 'Almost never' },
                    { value: 2, label: 'মাঝে মাঝে', text: 'Sometimes' },
                    { value: 1, label: 'বেশ বেশি', text: 'Fairly often' },
                    { value: 0, label: 'খুব বেশি', text: 'Very often' }
                ]
            },
            {
                id: 5,
                text: 'জিনিসগুলি আপনার নিয়ন্ত্রণে চলছে?',
                bangla: 'জিনিসগুলি আপনার নিয়ন্ত্রণে চলছে?',
                options: [
                    { value: 4, label: 'কখনও', text: 'Never' },
                    { value: 3, label: 'প্রায় কখনও', text: 'Almost never' },
                    { value: 2, label: 'মাঝে মাঝে', text: 'Sometimes' },
                    { value: 1, label: 'বেশ বেশি', text: 'Fairly often' },
                    { value: 0, label: 'খুব বেশি', text: 'Very often' }
                ]
            },
            {
                id: 6,
                text: 'আপনি যে সব কিছু সম্পন্ন করতে হবে তা মোকাবেলা করতে পেরেছিলেন?',
                bangla: 'আপনি যে সব কিছু সম্পন্ন করতে হবে তা মোকাবেলা করতে পেরেছিলেন?',
                options: [
                    { value: 4, label: 'কখনও', text: 'Never' },
                    { value: 3, label: 'প্রায় কখনও', text: 'Almost never' },
                    { value: 2, label: 'মাঝে মাঝে', text: 'Sometimes' },
                    { value: 1, label: 'বেশ বেশি', text: 'Fairly often' },
                    { value: 0, label: 'খুব বেশি', text: 'Very often' }
                ]
            },
            {
                id: 7,
                text: 'আপনি নিয়ন্ত্রণ ছাড়াই রাগ অনুভব করেছেন?',
                bangla: 'আপনি নিয়ন্ত্রণ ছাড়াই রাগ অনুভব করেছেন?',
                options: [
                    { value: 0, label: 'কখনও', text: 'Never' },
                    { value: 1, label: 'প্রায় কখনও', text: 'Almost never' },
                    { value: 2, label: 'মাঝে মাঝে', text: 'Sometimes' },
                    { value: 3, label: 'বেশ বেশি', text: 'Fairly often' },
                    { value: 4, label: 'খুব বেশি', text: 'Very often' }
                ]
            },
            {
                id: 8,
                text: 'আপনি সমস্যাগুলি মোকাবেলা করতে বেশি পেয়েছেন?',
                bangla: 'আপনি সমস্যাগুলি মোকাবেলা করতে বেশি পেয়েছেন?',
                options: [
                    { value: 0, label: 'কখনও', text: 'Never' },
                    { value: 1, label: 'প্রায় কখনও', text: 'Almost never' },
                    { value: 2, label: 'মাঝে মাঝে', text: 'Sometimes' },
                    { value: 3, label: 'বেশ বেশি', text: 'Fairly often' },
                    { value: 4, label: 'খুব বেশি', text: 'Very often' }
                ]
            },
            {
                id: 9,
                text: 'আপনি অভিভূত বোধ করেছেন?',
                bangla: 'আপনি অভিভূত বোধ করেছেন?',
                options: [
                    { value: 0, label: 'কখনও', text: 'Never' },
                    { value: 1, label: 'প্রায় কখনও', text: 'Almost never' },
                    { value: 2, label: 'মাঝে মাঝে', text: 'Sometimes' },
                    { value: 3, label: 'বেশ বেশি', text: 'Fairly often' },
                    { value: 4, label: 'খুব বেশি', text: 'Very often' }
                ]
            },
            {
                id: 10,
                text: 'আপনি এমন অনুভব করেছেন যে আপনি শিঙ্গা নিয়ন্ত্রণ করতে পারছেন না?',
                bangla: 'আপনি এমন অনুভব করেছেন যে আপনি চাপ নিয়ন্ত্রণ করতে পারছেন না?',
                options: [
                    { value: 0, label: 'কখনও', text: 'Never' },
                    { value: 1, label: 'প্রায় কখনও', text: 'Almost never' },
                    { value: 2, label: 'মাঝে মাঝে', text: 'Sometimes' },
                    { value: 3, label: 'বেশ বেশি', text: 'Fairly often' },
                    { value: 4, label: 'খুব বেশি', text: 'Very often' }
                ]
            }
        ]
    }
};

export const calculateScore = (assessmentType, answers) => {
    const questions = assessmentConfig[assessmentType].questions;
    let score = 0;
    
    answers.forEach((answer) => {
        if (answer && answer.value !== undefined) {
            score += answer.value;
        }
    });
    
    return score;
};

export const getSeverityLevel = (assessmentType, score) => {
    const config = assessmentConfig[assessmentType];
    const severityKeys = Object.keys(config.severity).map(Number).sort((a, b) => b - a);
    
    for (let key of severityKeys) {
        if (score >= key) {
            return config.severity[key];
        }
    }
    
    return config.severity[0];
};
