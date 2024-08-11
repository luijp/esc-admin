import * as tagsApi from '../../../../api/tags.js';
import * as postApi from '../../../../api/post.js';

export default async function (tagList, postId) {
    console.log(tagList)
    if (!tagList || tagList.length === 0) {
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
    for (const tag of tagList) {
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