<script setup lang="ts">
import { useData } from "vitepress";
import { computed } from "vue";

defineProps<{
  size?: number;
}>();

const { isDark } = useData();

const colors = computed(() => {
  if (isDark.value) {
    return {
      faceStart: "#64d8cb",
      faceStartOpacity: "0.15",
      faceEnd: "#b39ddb",
      faceEndOpacity: "0.25",
      edgeStart: "#64d8cb",
      edgeMid: "#8bb4d8",
      edgeEnd: "#b39ddb",
      strokeWidth: "1.5",
      textFill: "#e0f2f1",
      glowOpacity: "0.8",
      dropShadow: "drop-shadow(0 0 24px rgba(100, 216, 203, 0.4)) drop-shadow(0 0 48px rgba(179, 157, 219, 0.2))",
    };
  }
  return {
    faceStart: "#4db6ac",
    faceStartOpacity: "0.08",
    faceEnd: "#9575cd",
    faceEndOpacity: "0.12",
    edgeStart: "#4db6ac",
    edgeMid: "#7a9bc0",
    edgeEnd: "#9575cd",
    strokeWidth: "1.2",
    textFill: "#2e8b83",
    glowOpacity: "0.4",
    dropShadow: "drop-shadow(0 0 16px rgba(100, 216, 203, 0.2))",
  };
});
</script>

<template>
  <div class="d20-wrapper">
    <svg
      :width="size ?? 320"
      :height="size ?? 320"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      class="d20-svg"
      :style="{ filter: colors.dropShadow }"
    >
      <defs>
        <filter id="d20-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            :values="`0 0 0 0 0.392
                      0 0 0 0 0.847
                      0 0 0 0 0.796
                      0 0 0 ${colors.glowOpacity} 0`"
            result="glow"
          />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="d20-face-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" :stop-color="colors.faceStart" :stop-opacity="colors.faceStartOpacity" />
          <stop offset="100%" :stop-color="colors.faceEnd" :stop-opacity="colors.faceEndOpacity" />
        </linearGradient>

        <linearGradient id="d20-edge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" :stop-color="colors.edgeStart" />
          <stop offset="50%" :stop-color="colors.edgeMid" />
          <stop offset="100%" :stop-color="colors.edgeEnd" />
        </linearGradient>
      </defs>

      <g filter="url(#d20-glow)" class="d20-die">
        <polygon
          points="100,12 38,55 162,55"
          fill="url(#d20-face-grad)"
          stroke="url(#d20-edge-grad)"
          :stroke-width="colors.strokeWidth"
        />
        <polygon
          points="38,55 18,130 100,100"
          fill="url(#d20-face-grad)"
          stroke="url(#d20-edge-grad)"
          :stroke-width="colors.strokeWidth"
        />
        <polygon
          points="162,55 182,130 100,100"
          fill="url(#d20-face-grad)"
          stroke="url(#d20-edge-grad)"
          :stroke-width="colors.strokeWidth"
        />
        <polygon
          points="38,55 162,55 100,100"
          fill="url(#d20-face-grad)"
          stroke="url(#d20-edge-grad)"
          :stroke-width="colors.strokeWidth"
        />
        <polygon
          points="18,130 100,100 60,175"
          fill="url(#d20-face-grad)"
          stroke="url(#d20-edge-grad)"
          :stroke-width="colors.strokeWidth"
        />
        <polygon
          points="182,130 100,100 140,175"
          fill="url(#d20-face-grad)"
          stroke="url(#d20-edge-grad)"
          :stroke-width="colors.strokeWidth"
        />
        <polygon
          points="60,175 140,175 100,100"
          fill="url(#d20-face-grad)"
          stroke="url(#d20-edge-grad)"
          :stroke-width="colors.strokeWidth"
        />
        <polygon
          points="18,130 60,175 100,190"
          fill="url(#d20-face-grad)"
          stroke="url(#d20-edge-grad)"
          :stroke-width="colors.strokeWidth"
        />
        <polygon
          points="182,130 140,175 100,190"
          fill="url(#d20-face-grad)"
          stroke="url(#d20-edge-grad)"
          :stroke-width="colors.strokeWidth"
        />
        <polygon
          points="60,175 140,175 100,190"
          fill="url(#d20-face-grad)"
          stroke="url(#d20-edge-grad)"
          :stroke-width="colors.strokeWidth"
        />

        <text
          x="100"
          y="108"
          text-anchor="middle"
          dominant-baseline="central"
          font-family="Georgia, serif"
          font-size="28"
          font-weight="bold"
          :fill="colors.textFill"
          class="d20-text"
        >
          20
        </text>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.d20-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.d20-svg {
  animation: d20-float 6s ease-in-out infinite;
  transition: filter 0.3s ease;
}

.d20-die {
  transform-origin: 100px 100px;
  animation: d20-rock 8s ease-in-out infinite;
}

.d20-text {
  transition: fill 0.3s ease;
}

:global(.dark) .d20-text {
  animation: d20-pulse-dark 3s ease-in-out infinite;
}

:global(html:not(.dark)) .d20-text {
  animation: d20-pulse-light 3s ease-in-out infinite;
}

@keyframes d20-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
}

@keyframes d20-rock {
  0%,
  100% {
    transform: rotate(-3deg);
  }
  50% {
    transform: rotate(3deg);
  }
}

@keyframes d20-pulse-dark {
  0%,
  100% {
    opacity: 0.9;
    fill: #64d8cb;
  }
  50% {
    opacity: 1;
    fill: #b39ddb;
  }
}

@keyframes d20-pulse-light {
  0%,
  100% {
    opacity: 0.9;
    fill: #2e8b83;
  }
  50% {
    opacity: 1;
    fill: #7e57c2;
  }
}

@media (max-width: 768px) {
  .d20-svg {
    width: 200px !important;
    height: 200px !important;
  }
}
</style>
