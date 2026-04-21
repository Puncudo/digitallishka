<script setup>
import { useRoute } from 'vue-router'
import mockData          from '@/data/mock.json'
import ProfileHero       from '@/components/profile/ProfileHero.vue'
import RecruitmentTrack  from '@/components/profile/RecruitmentTrack.vue'
import IndicationsSection from '@/components/profile/IndicationsSection.vue'
import ContentTabs       from '@/components/profile/ContentTabs.vue'
import CommentSection    from '@/components/profile/CommentSection.vue'

const route = useRoute()
const candidate = mockData.candidates.find(c => c.id === route.params.id) || mockData.candidates[0]
</script>

<template>
  <div class="profile-page">
    <ProfileHero :candidate="candidate" />

    <div class="profile-body">
      <!-- Track + Indications: stacked on mobile, side-by-side on desktop -->
      <div class="section-grid">
        <RecruitmentTrack :track="candidate.recruitmentTrack" />
        <IndicationsSection :indications="candidate.indications" />
      </div>

      <ContentTabs
        :tasks="candidate.tasks"
        :reports="candidate.reports"
        :tasks-total="candidate.tasksTotal"
        :reports-total="candidate.reportsTotal"
        :reports-overdue="candidate.reportsOverdue"
        :reports-alert="candidate.reportsAlert"
      />

      <CommentSection :comment="candidate.comment" :candidate-name="candidate.name" />
    </div>
  </div>
</template>

<style scoped>
.profile-body {
  display: flex;
  flex-direction: column;
  padding: 0px 0 0px;   /* no side padding — components own their own gutters */
}

.section-grid {
  padding: 20px 20px;        /* only the inner sections need horizontal breathing room */
}

/* Desktop */
@media (min-width: 768px) {
  .profile-body { padding: 20px 28px 40px; gap: 16px; }

  .section-grid {
    padding: 0;           /* desktop: layout handled by grid */
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 16px;
    align-items: start;
  }
}
</style>
