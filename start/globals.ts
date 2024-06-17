import { icons as heroIcons } from '@iconify-json/heroicons'
import { addCollection, edgeIconify } from 'edge-iconify'
import edge from 'edge.js'

/**
 * Add heroIcons collection
 */
addCollection(heroIcons)

/**
 * Register the plugin
 */
edge.use(edgeIconify)
