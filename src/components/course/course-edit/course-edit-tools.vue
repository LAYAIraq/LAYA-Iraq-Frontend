<!--
  Filename: course-edit-tools.vue
  Use: wrap all course edit tools
  Creator: cmc
  Since: v1.3.0
-->
<template>
  <div
    class="container"
    :class="langIsAr ? 'text-right' : ''"
  >
    <course-block-edit
      :name="name"
      :course-path="coursePath"
    ></course-block-edit>

    <course-type-edit
      :name="name"
      :course-path="coursePath"
      @changedType="$emit('saveChanges')"
    ></course-type-edit>

    <course-block-new
      :name="name"
      :course-path="coursePath"
    >
    </course-block-new>

    <course-nav-edit></course-nav-edit>

    <course-rename @renamed="$emit('saveChanges')"></course-rename>

    <course-copy @success="$emit('saveChanges')"></course-copy>

    <course-category-change @changedCategory="$emit('saveChanges')"></course-category-change>

    <course-language-change @changedLanguage="$emit('saveChanges')"></course-language-change>

    <course-keywords-change @changedKeywords="$emit('saveChanges')"></course-keywords-change>

    <course-abstract-change @changedAbstract="$emit('saveChanges')"></course-abstract-change>

    <course-block-delete
      :name="name"
      :course-path="coursePath"
    ></course-block-delete>

    <course-delete :name="name"></course-delete>

    <!--<course-stats></course-stats>-->

    <course-preferences @settingsChanged="$emit('saveChanges')"></course-preferences>

    <course-feedback-download @success="$emit('showToast')"></course-feedback-download>
  </div>
</template>
<script>
import {
  CourseFeedbackDownload,
  CourseBlockNew,
  CoursePreferences,
  CourseBlockEdit,
  CourseCategoryChange,
  CourseLanguageChange,
  CourseNavEdit,
  CourseBlockDelete,
  CourseCopy,
  CourseKeywordsChange,
  CourseAbstractChange,
  CourseDelete,
  CourseTypeEdit,
  CourseRename
} from '@/components/course/course-edit'
import { locale, routes } from '@/mixins'

export default {
  name: 'CourseEditTools',
  components: {
    CourseFeedbackDownload,
    CourseBlockNew,
    CoursePreferences,
    CourseBlockEdit,
    CourseCategoryChange,
    CourseLanguageChange,
    CourseNavEdit,
    CourseBlockDelete,
    CourseCopy,
    CourseKeywordsChange,
    CourseAbstractChange,
    CourseDelete,
    CourseTypeEdit,
    CourseRename
  },
  mixins: [locale, routes]
}
</script>
