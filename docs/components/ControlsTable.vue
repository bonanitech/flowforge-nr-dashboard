<template>
    <table style="width: 100%;">
        <thead>
            <tr>
                <th>msg.</th>
                <th>Example</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(d, control) in page.frontmatter?.controls" :key="control">
                <td>{{ control }}</td>
                <td><code>{{ d.example }}</code></td>
                <td>{{ d.description }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script setup>
import { useData } from 'vitepress'

const { page } = useData()
</script>

<script>
export default {
    name: 'PropsTable'
}
</script>