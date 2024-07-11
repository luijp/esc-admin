import * as categoriesApi from '../../../../api/categories.js';
import * as postApi from '../../../../api/post.js';

export default async function (categoryList,postId){
    if(!categoryList){
        return
    }

    const categoriesList =  (await categoriesApi.getCategoriesList()).data
    const categoriesNameCollections = {}
    const categoriesIdCollections = {}
    categoriesList.forEach(item =>{
        categoriesNameCollections[item.name] = item
        categoriesIdCollections[item.id] = item
    })
    const categoryResult = []
    for (const categories of categoryList.value) {
        if(!categoriesNameCollections.hasOwnProperty(categories)){
            await categoriesApi.updateCategories({
                name: categories,
                alias: categories.replace(' ','-').toLowerCase(),
                parentId:0,
            })

        }
        categoryResult.push(categoriesNameCollections[categories].id)
    }

    await postApi.addCategories(categoryResult,postId)

}