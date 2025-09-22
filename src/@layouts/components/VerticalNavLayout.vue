<script setup>
import { VerticalNav } from '@layouts/components'
import { useLayoutConfigStore } from '@layouts/stores/config'
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()



const tabs = [
  {
    name: 'dashboards-fit-dash',
    label: 'Home',
    icon: 'tabler-smart-home',
    route: { name: 'dashboards-fit-dash' },
  },
  {
    name: 'apps-fitcode-reports',
    label: 'Reports',
    icon: 'tabler-file-text',
    route: { name: 'apps-fitcode-reports' },
  },
  {
    name: 'apps-fitcode-trends',
    label: 'Trends',
    icon: 'tabler-chart-line',
    route: { name: 'apps-fitcode-trends' },
  },
]


const tabRefs = ref([])
const indicatorLeft = ref(0)
const indicatorWidth = ref(0)


const updateIndicator = () => {
  nextTick(() => {
    const activeIndex = tabs.findIndex(t => t.name === activeTab.value)
    const tabEl = tabRefs.value[activeIndex]
    if (tabEl) {
      indicatorLeft.value = tabEl.offsetLeft
      indicatorWidth.value = tabEl.offsetWidth
    }
  })
}


const goTo = (tab) => {
  activeTab.value = tab.name
  router.push(tab.route)
}

const activeTab = ref(route.name || 'dashboards-fit-dash')

watch(route, () => {
  activeTab.value = route.name
  updateIndicator()
})


onMounted(() => updateIndicator())
watch(activeTab, updateIndicator)
const props = defineProps({
  navItems: {
    type: null,
    required: true,
  },
  verticalNavAttrs: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})

const { width: windowWidth } = useWindowSize()
const configStore = useLayoutConfigStore()
const isOverlayNavActive = ref(false)
const isLayoutOverlayVisible = ref(false)
const toggleIsOverlayNavActive = useToggle(isOverlayNavActive)


syncRef(isOverlayNavActive, isLayoutOverlayVisible)

watch(windowWidth, () => {
  if (!configStore.isLessThanOverlayNavBreakpoint && isLayoutOverlayVisible.value)
    isLayoutOverlayVisible.value = false
})

const verticalNavAttrs = computed(() => {
  const vNavAttrs = toRef(props, 'verticalNavAttrs')

  const {
    wrapper: verticalNavWrapper,
    wrapperProps: verticalNavWrapperProps,
    ...additionalVerticalNavAttrs
  } = vNavAttrs.value

  
  return {
    verticalNavWrapper,
    verticalNavWrapperProps,
    additionalVerticalNavAttrs,
  }
})
</script>

<template>
  <div
    class="layout-wrapper"
    data-allow-mismatch
    :class="configStore._layoutClasses"
  >
    <component
      :is="verticalNavAttrs.verticalNavWrapper ? verticalNavAttrs.verticalNavWrapper : 'div'"
      v-bind="verticalNavAttrs.verticalNavWrapperProps"
      class="vertical-nav-wrapper"
    >
      <VerticalNav
        :is-overlay-nav-active="isOverlayNavActive"
        :toggle-is-overlay-nav-active="toggleIsOverlayNavActive"
        :nav-items="props.navItems"
        v-bind="{ ...verticalNavAttrs.additionalVerticalNavAttrs }"
      >
        <template #nav-header>
          <slot name="vertical-nav-header" />
        </template>
        <template #before-nav-items>
          <slot name="before-vertical-nav-items" />
        </template>
      </VerticalNav>
    </component>
    <div class="layout-content-wrapper">
      <header
        class="layout-navbar"
        :class="[{ 'navbar-blur': configStore.isNavbarBlurEnabled }]"
      >
        <div class="navbar-content-container">
          <slot
            name="navbar"
            :toggle-vertical-overlay-nav-active="toggleIsOverlayNavActive"
          />
        </div>
      </header>
      <main class="layout-page-content">
        <div class="page-content-container">
          <slot />
        </div>
      </main>
      <footer class="layout-footer">
        <div class="footer-content-container">
          <slot name="footer" />
        </div>
      </footer>
    </div>
    <div
      class="layout-overlay"
      :class="[{ visible: isLayoutOverlayVisible }]"
      @click="() => { isLayoutOverlayVisible = !isLayoutOverlayVisible }"
    />
  </div>

   <!-- Bottom nav only for small devices -->
   <nav class="bottom-nav d-md-none">
    <ul>
      <li
        v-for="(tab, index) in tabs"
        :key="tab.name"
        :class="{ active: activeTab === tab.name }"
        @click="goTo(tab)"
        ref="tabRefs"
      >
        <i :class="tab.icon"></i>
        <span>{{ tab.label }}</span>
      </li>
    </ul>

    
    <div
      class="indicator"
      :style="{
        width: indicatorWidth + 'px',
        left: indicatorLeft + 'px'
      }"
    ></div>
  </nav>
</template>

<style lang="scss">
@use "@configured-variables" as variables;
@use "@layouts/styles/placeholders";
@use "@layouts/styles/mixins";

.layout-wrapper.layout-nav-type-vertical {
  // TODO(v2): Check why we need height in vertical nav & min-height in horizontal nav
  block-size: 100%;

  .layout-content-wrapper {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-block-size: 100dvh;
    transition: padding-inline-start 0.2s ease-in-out;
    will-change: padding-inline-start;

    @media screen and (min-width: 1280px) {
      padding-inline-start: variables.$layout-vertical-nav-width;
    }
  }

  .layout-navbar {
    z-index: variables.$layout-vertical-nav-layout-navbar-z-index;

    .navbar-content-container {
      block-size: variables.$layout-vertical-nav-navbar-height;
    }

    @at-root {
      .layout-wrapper.layout-nav-type-vertical {
        .layout-navbar {
          @if variables.$layout-vertical-nav-navbar-is-contained {
            @include mixins.boxed-content;
          }
          /* stylelint-disable-next-line @stylistic/indentation */
          @else {
            .navbar-content-container {
              @include mixins.boxed-content;
            }
          }
        }
      }
    }
  }

  &.layout-navbar-sticky .layout-navbar {
    @extend %layout-navbar-sticky;
  }

  &.layout-navbar-hidden .layout-navbar {
    @extend %layout-navbar-hidden;
  }

  // 👉 Footer
  .layout-footer {
    @include mixins.boxed-content;
  }

  // 👉 Layout overlay
  .layout-overlay {
    position: fixed;
    z-index: variables.$layout-overlay-z-index;
    background-color: rgb(0 0 0 / 60%);
    cursor: pointer;
    inset: 0;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s ease-in-out;
    will-change: opacity;

    &.visible {
      opacity: 1;
      pointer-events: auto;
    }
  }

  // Adjust right column pl when vertical nav is collapsed
  &.layout-vertical-nav-collapsed .layout-content-wrapper {
    @media screen and (min-width: 1280px) {
      padding-inline-start: variables.$layout-vertical-nav-collapsed-width;
    }
  }

  // 👉 Content height fixed
  &.layout-content-height-fixed {
    .layout-content-wrapper {
      max-block-size: 100dvh;
    }

    .layout-page-content {
      display: flex;
      overflow: hidden;

      .page-content-container {
        inline-size: 100%;

        > :first-child {
          max-block-size: 100%;
          overflow-y: auto;
        }
      }
    }
  }
}
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fff;
  box-shadow: 0 -1px 6px rgba(0,0,0,0.1);
  z-index: 1000;
}

.bottom-nav ul {
  display: flex;
  justify-content: space-around;
  margin: 0;
  padding: 0.5rem 0;
  list-style: none;
  position: relative;
}

.bottom-nav li {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  padding: 0.6rem 0.4rem;
  color: #999; 
  transition: color 0.3s ease;
  z-index: 1;
}

.bottom-nav i {
  font-size: 20px;
  margin-bottom: 2px;
}

.bottom-nav span {
  font-size: 12px;
}


.bottom-nav li.active {
  color: #fff; 
}

.bottom-nav li.active::before {
  content: "";
  position: absolute;
  inset: 0.2rem 0.6rem; 
  background: purple;
  border-radius: 20px 20px 0 0; 
  z-index: -1;
  transition: all 0.3s ease;
}

</style>
