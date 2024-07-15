import * as tagsApi from '../../../../api/tags.js';
import * as postApi from '../../../../api/post.js';

export default async function (tagList, postId) {
    if (!tagList) {
        return
    }
    const tagsList = (await tagsApi.getTags()).data
    const tagsNameCollections = {}
    const tagsIdCollections = {}
    tagsList.forEach(item => {
        tagsNameCollections[item.name] = item
        tagsIdCollections[item.id] = item
    })
    const tagResult = []
    for (const tag of tagList.value) {
        if (!tagsNameCollections.hasOwnProperty(tag)) {
            await tagsApi.updateTag({
                name: tag,
                alias: tag.replace(' ', '-').toLower(),
            })
        }
        tagResult.push(tagsNameCollections[tag].id)
    }
    await postApi.addTags(tagResult, postId)
}