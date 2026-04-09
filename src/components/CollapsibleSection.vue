<template>
  <div class="collapsible-section">
    <div class="toggle-row hide-on-print" :class="{ open: isOpen }" @click="toggle">
      <div class="toggle-left">
        <span class="chev-wrap">
          <svg class="chev-icon" viewBox="0 0 11 11" fill="none">
            <path d="M2 4L5.5 7.5L9 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </span>
        <span class="toggle-title">{{ title }}</span>
        <span v-if="meta" class="toggle-meta">{{ meta }}</span>
      </div>
      <div class="toggle-actions hide-on-print">
        <label v-if="showPrintInclude" class="print-include-toggle" @click.stop>
          <input v-model="includeInPrint" type="checkbox" class="print-include-toggle__input" />
          <span class="print-include-toggle__text">Include in printout</span>
        </label>
        <slot name="actions" />
      </div>
    </div>

    <div class="content-wrap" ref="contentRef" :style="contentStyle">
      <div class="content-inner" ref="innerRef" >
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  meta: {
    type: String,
    default: '',
  },
  defaultOpen: {
    type: Boolean,
    default: true,
  },
  /** When true, shows “Include in printout” bound to v-model:includeInPrint */
  showPrintInclude: {
    type: Boolean,
    default: false,
  },
})

const includeInPrint = defineModel('includeInPrint', { type: Boolean, default: false })

const emit = defineEmits(['open', 'close'])

const isOpen = ref(props.defaultOpen)
const contentRef = ref(null)
const innerRef = ref(null)
const contentHeight = ref(0)

const contentStyle = computed(() => ({
  maxHeight: isOpen.value ? contentHeight.value + 'px' : '0px',
  opacity: isOpen.value ? 1 : 0,
}))

function measure() {
  if (innerRef.value) {
    contentHeight.value = innerRef.value.offsetHeight
  }
}

async function toggle() {
  if (!isOpen.value) {
    isOpen.value = true
    await nextTick()
    measure()
    emit('open')
  } else {
    measure()
    isOpen.value = false
    emit('close')
  }
}

let ro = null

onMounted(() => {
  measure()
  ro = new ResizeObserver(measure)
  if (innerRef.value) ro.observe(innerRef.value)
})

onBeforeUnmount(() => {
  ro?.disconnect()
})

</script>

<style scoped>
.collapsible-section {
  border-top: 1px solid var(--color-border-tertiary, rgba(0, 0, 0, 0.12));
}

/* ── Toggle row ── */
.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px var(--space-6);
  cursor: pointer;
  user-select: none;
  /* border-bottom: 0.5px solid var(--color-border-tertiary, rgba(0, 0, 0, 0.08)); */
  transition: background 0.15s;
}

.toggle-row:hover,
.toggle-row.open {
  background: var(--color-background-secondary, rgba(0, 0, 0, 0.03));
}

.toggle-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* ── Chevron ── */
.chev-wrap {
  display: flex;
  align-items: center;
  color: var(--color-text-tertiary, #aaa);
  transition: color 0.15s;
  flex-shrink: 0;
}

.toggle-row:hover .chev-wrap,
.toggle-row.open .chev-wrap {
  color: var(--color-text-secondary, #888);
}

.chev-icon {
  width: 11px;
  height: 11px;
  transition: transform 0.22s cubic-bezier(0.4, 0, 0.2, 1);
}

.toggle-row.open .chev-icon {
  transform: rotate(-180deg);
}

/* ── Title + meta ── */
.toggle-title {

  font-size: 14px;
  font-weight: 400;
  /* color: var(--color-text-primary, #111); */
  color: #666;
  text-decoration: underline;
  text-decoration-style: dashed;
  text-decoration-thickness: 1px;
  text-underline-offset: 4px;
  text-decoration-color: #888;
  white-space: nowrap;
}

.toggle-meta {
  /* font-family: 'IBM Plex Mono', monospace; */
  font-size: 12px;
  font-weight: 400;
  color: var(--color-text-tertiary, #aaa);
  margin-left:0.25rem
  /* letter-spacing: -0.01em; */
}

.toggle-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.65rem;
  flex-shrink: 0;
}

.print-include-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.01em;
  color: color-mix(in oklab, var(--muted, #64748b) 88%, var(--paper, #fff));
  user-select: none;
}

.print-include-toggle__input {
  width: 0.875rem;
  height: 0.875rem;
  accent-color: color-mix(in oklab, var(--accent2, #22c55e) 50%, var(--muted, #64748b));
  cursor: pointer;
}

.print-include-toggle:hover .print-include-toggle__text {
  color: color-mix(in oklab, var(--muted, #64748b) 35%, var(--ink, #0f172a));
}

/* ── Collapsible content ── */
.content-wrap {
  overflow: hidden;
  transition:
    max-height 0.28s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.22s ease;
}


/* ── Print ── */
@media print {
  .chev-wrap {
    display: none;
  }

  .toggle-row {
    background: transparent !important;
    cursor: default;
  }

  .toggle-actions {
    display: none;
  }

  .content-wrap {
    max-height: none !important;
    opacity: 1 !important;
    overflow: visible !important;
  }
}
</style>