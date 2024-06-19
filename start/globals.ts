import { icons as heroIcons } from '@iconify-json/heroicons'
import { icons as animatedIcons } from '@iconify-json/line-md'
import { addCollection, edgeIconify } from 'edge-iconify'
import edge from 'edge.js'

/**
 * Add heroIcons collection
 */
addCollection(heroIcons)
addCollection(animatedIcons)

/**
 * Register the plugin
 */
edge.use(edgeIconify)
