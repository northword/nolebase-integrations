import { h } from 'vue'

import {
  LayoutMode,
  type Options as NolebaseEnhancedReadabilitiesOptions,
} from '@nolebase/vitepress-plugin-enhanced-readabilities'
import {
  NolebaseEnhancedReadabilitiesMenu,
  NolebaseEnhancedReadabilitiesPlugin,
  NolebaseEnhancedReadabilitiesScreenMenu,
} from '@nolebase/vitepress-plugin-enhanced-readabilities'

import type {
  Options as NolebaseInlineLinkPreviewOptions,
} from '@nolebase/vitepress-plugin-inline-link-preview'
import {
  NolebaseInlineLinkPreviewPlugin,
} from '@nolebase/vitepress-plugin-inline-link-preview'

import {
  NolebaseHighlightTargetedHeading,
  NolebaseNolebaseHighlightTargetedHeadingPlugin,
} from '@nolebase/vitepress-plugin-highlight-targeted-heading'

import type {
  Options as NolebaseGitChangelogOptions,
} from '@nolebase/vitepress-plugin-git-changelog/client'
import {
  NolebaseGitChangelogPlugin,
} from '@nolebase/vitepress-plugin-git-changelog/client'

import type {
  Options as NolebasePagePropertiesOptions,
} from '@nolebase/vitepress-plugin-page-properties/client'
import {
  NolebasePagePropertiesPlugin,
} from '@nolebase/vitepress-plugin-page-properties/client'

import type { PluginSet } from '../../types'

export interface NolebasePluginSetOptions<PagePropertiesObject extends object = any> {
  enhancedReadabilities?: {
    enable?: boolean
    options?: NolebaseEnhancedReadabilitiesOptions
  }
  highlightTargetedHeading?: {
    enable?: boolean
  }
  linkPreview?: {
    enable?: boolean
    options?: NolebaseInlineLinkPreviewOptions
  }
  gitChangelog?: {
    enable?: boolean
    options?: NolebaseGitChangelogOptions
  }
  pageProperties?: {
    enable?: boolean
    options?: NolebasePagePropertiesOptions<PagePropertiesObject>
  }
}

const defaultOptions: NolebasePluginSetOptions = {
  enhancedReadabilities: {
    enable: true,
    options: {
      layoutSwitch: {
        defaultMode: LayoutMode.BothWidthAdjustable,
      },
      spotlight: {
        defaultToggle: true,
      },
    },
  },
  highlightTargetedHeading: {
    enable: true,
  },
  linkPreview: {
    enable: true,
  },
  gitChangelog: {
    enable: true,
    options: {
      mapContributors: [],
    },
  },
  pageProperties: {
    enable: true,
    options:
    {
      properties: {
        'en': [
          {
            key: 'tags',
            type: 'tags',
            title: 'Tags',
          },
          {
            key: 'progress',
            type: 'progress',
            title: 'Progress',
          },
          {
            key: 'createdAt',
            type: 'datetime',
            title: 'Created at',
            formatAsFrom: true,
            dateFnsLocaleName: 'enUS',
          },
          {
            key: 'updatedAt',
            type: 'datetime',
            title: 'Updated at',
            formatAsFrom: true,
            dateFnsLocaleName: 'enUS',
          },
          {
            key: 'wordsCount',
            type: 'dynamic',
            title: 'Word count',
            options: {
              type: 'wordsCount',
            },
          },
          {
            key: 'readingTime',
            type: 'dynamic',
            title: 'Reading time',
            options: {
              type: 'readingTime',
              dateFnsLocaleName: 'enUS',
            },
          },
        ],
        'zh-CN': [
          {
            key: 'tags',
            type: 'tags',
            title: '标签',
          },
          {
            key: 'progress',
            type: 'progress',
            title: '进度',
          },
          {
            key: 'createdAt',
            type: 'datetime',
            title: '创建时间',
            formatAsFrom: true,
            dateFnsLocaleName: 'zhCN',
          },
          {
            key: 'updatedAt',
            type: 'datetime',
            title: '更新时间',
            formatAsFrom: true,
            dateFnsLocaleName: 'zhCN',
          },
          {
            key: 'wordsCount',
            type: 'dynamic',
            title: '字数',
            options: {
              type: 'wordsCount',
            },
          },
          {
            key: 'readingTime',
            type: 'dynamic',
            title: '阅读时间',
            options: {
              type: 'readingTime',
              dateFnsLocaleName: 'zhCN',
            },
          },
        ],
      },
    },
  },
}

function applyOptionsWithDefaults<PagePropertiesObject extends object = any>(options: NolebasePluginSetOptions<any>): NolebasePluginSetOptions<PagePropertiesObject> {
  const mergedOptions: NolebasePluginSetOptions<any> = { ...options }
  for (const key in defaultOptions) {
    const k = key as keyof NolebasePluginSetOptions<any>

    if (typeof mergedOptions[k] === 'undefined' || !mergedOptions[k])
      mergedOptions[k] = defaultOptions[k]
  }

  return mergedOptions as NolebasePluginSetOptions<PagePropertiesObject>
}

export function NolebasePluginSet<PagePropertiesObject extends object = any>(
  options?: NolebasePluginSetOptions<PagePropertiesObject>,
): PluginSet {
  const opts = applyOptionsWithDefaults(options || {})

  return {
    configureLayout({ helpers }) {
      if (opts.highlightTargetedHeading?.enable)
        helpers.defineSlot('layout-top', () => h(NolebaseHighlightTargetedHeading))

      if (opts.enhancedReadabilities?.enable) {
        helpers.defineSlot('nav-bar-content-after', () => h(NolebaseEnhancedReadabilitiesMenu))
        helpers.defineSlot('nav-screen-content-after', () => h(NolebaseEnhancedReadabilitiesScreenMenu))
      }
    },
    async enhanceApp({ app }) {
      if (opts.enhancedReadabilities?.enable) {
        const enhancedReadabilitiesOptions = opts.enhancedReadabilities?.options ? [opts.enhancedReadabilities.options] : []
        app.use(NolebaseEnhancedReadabilitiesPlugin, ...enhancedReadabilitiesOptions)

        await import('@nolebase/vitepress-plugin-enhanced-readabilities/dist/style.css')
      }

      if (opts.highlightTargetedHeading?.enable) {
        app.use(NolebaseNolebaseHighlightTargetedHeadingPlugin)

        await import('@nolebase/vitepress-plugin-highlight-targeted-heading/dist/style.css')
      }

      if (opts.linkPreview?.enable) {
        const linkPreviewOptions = opts.linkPreview?.options ? [opts.linkPreview.options] : []
        app.use(NolebaseInlineLinkPreviewPlugin, ...linkPreviewOptions)

        await import('@nolebase/vitepress-plugin-inline-link-preview/dist/style.css')
      }

      if (opts.gitChangelog?.enable) {
        const gitChangelogOptions = opts.gitChangelog?.options ? [opts.gitChangelog.options] : []
        app.use(NolebaseGitChangelogPlugin, ...gitChangelogOptions)
      }

      if (opts.pageProperties?.enable) {
        const pagePropertiesOptions = opts.pageProperties?.options ? [opts.pageProperties.options] : []
        app.use(NolebasePagePropertiesPlugin<PagePropertiesObject>(), ...pagePropertiesOptions)

        await import('@nolebase/vitepress-plugin-page-properties/client/style.css')
      }
    },
  }
}