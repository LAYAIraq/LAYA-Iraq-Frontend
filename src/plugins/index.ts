/**
 * Filename: index.ts
 * Use: expose all Plugins to $laya
 * Creator: core
 * Date: unknown
 * Dependencies: none
 */

export { default as ChoiceQuestion } from './learning-assessment/choice-question'
// export { default as LayaQuizSort } from './laya-la-sort'
export { default as CategoryMatching } from './learning-assessment/category-matching'
export { default as ImageMatching } from './learning-assessment/image-matching'

// Course Content Blocks
// export { default as LayaAbleplayer } from './laya-lb-ableplayer'
export { default as FreeText } from './learning-block/free-text'
export { default as VideoPlayer } from './learning-block/video-player'

// Course Organization Blocks
export { default as ButtonNavigation } from './organization/button-navigation'
export { default as Certificate } from './organization/certificate'
export { default as Feedback } from './organization/feedback'
