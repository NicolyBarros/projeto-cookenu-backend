import { IRecipeDB, Recipe } from "../models/Recipe";
import { BaseDatabase } from "./BaseDatabase";

export class RecipeDatabase extends BaseDatabase {
    public static TABLE_RECIPES = "Cookenu_Recipes"

    public getAllRecipes = async (limit: number, page: number, order: string) => {
        const recipesDB: IRecipeDB[] = await BaseDatabase
            .connection(RecipeDatabase.TABLE_RECIPES)
            .select()
            .orderBy("updated_at" ,`${order}`)
            .limit(limit)
            .offset(limit * (page - 1));

        return recipesDB
    }

    public getRecipesQuery = async (search: string , limit: number, page: number, order: string) => {
        const recipesDB: IRecipeDB[] = await BaseDatabase
            .connection(RecipeDatabase.TABLE_RECIPES)
            .select()
            .where("title", "LIKE", `%${search}%`)
            .orderBy("updated_at" ,`${order}`)
            .limit(limit)
            .offset(limit * (page - 1));

        return recipesDB
    }

    public createRecipe = async (recipe: Recipe) => {
        const recipeDB: IRecipeDB = {
            id: recipe.getId(),
            title: recipe.getTitle(),
            description: recipe.getDescription(),
            created_at: recipe.getCreatedAt(),
            updated_at: recipe.getUpdatedAt(),
            creator_id: recipe.getCreatorId()
        }

        await BaseDatabase
            .connection(RecipeDatabase.TABLE_RECIPES)
            .insert(recipeDB)
    }

    public editRecipe = async (recipe: Recipe) => {
        const recipeDB: IRecipeDB = {
            id: recipe.getId(),
            title: recipe.getTitle(),
            description: recipe.getDescription(),
            created_at: recipe.getCreatedAt(),
            updated_at: recipe.getUpdatedAt(),
            creator_id: recipe.getCreatorId()
        }

        await BaseDatabase
            .connection(RecipeDatabase.TABLE_RECIPES)
            .update(recipeDB)
            .where({ id: recipeDB.id })
    }


    public findById = async (id: string) => {
        const result: IRecipeDB[] = await BaseDatabase
            .connection(RecipeDatabase.TABLE_RECIPES)
            .select()
            .where({ id })

        return result[0]
    }

    public deleteRecipe = async (id: string) => {
        await BaseDatabase
            .connection(RecipeDatabase.TABLE_RECIPES)
            .delete()
            .where({ id })
    }
}
