package net.hicks.recipe.services;

import net.hicks.recipe.beans.Recipe;
import net.hicks.recipe.beans.User;
import net.hicks.recipe.config.RecipeBookException;
import net.hicks.recipe.repos.RecipeRepository;
import net.hicks.recipe.repos.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;

    private static final Logger log = LoggerFactory.getLogger(RecipeService.class);

    public RecipeService(RecipeRepository recipeRepository, UserRepository userRepository) {
        this.recipeRepository = recipeRepository;
        this.userRepository = userRepository;
    }

    public List<Recipe> getAllRecipes() {
        try
        {
            List<Recipe> recipes = recipeRepository.findByOrderByIdDesc();
            recipes.forEach(e -> e.setAuthor(userRepository.getUserOrSystemUser(e.getCreatedBy())));
            return recipes;
        }
        catch (Exception e)
        {
            log.error(e.getLocalizedMessage(), e);
            throw new RecipeBookException(10, "Unable to retrieve recipes", e);
        }
    }

    public Recipe getRecipe(long recipeId) {
        try {
            Recipe recipe = recipeRepository.findById(recipeId).get();
            recipe.setAuthor(userRepository.getUserOrSystemUser(recipe.getCreatedBy()));
            return recipe;
        } catch (Exception e) {
            log.error(e.getLocalizedMessage(), e);
            throw new RecipeBookException(10, "Unable to retrieve recipe with id " + recipeId);
        }
    }

    public List<Recipe> getRecipesForUser(User user) {
        try {
            return recipeRepository.findAllByCreatedBy(user.getId())
                    .stream()
                    .map(it -> {
                        it.setAuthor(user);
                        return it;
                    })
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error(e.getLocalizedMessage(), e);
            throw new RecipeBookException(10, "Unable to retrieve recipes for user " + user);
        }
    }

    public Recipe updateRecipe(Recipe recipeToUpdate) {
        //todo may need checks before updating
        return recipeRepository.save(recipeToUpdate);
    }

    public Recipe createRecipe(Recipe recipe) {
        return recipeRepository.save(recipe);
    }

    public List<Recipe> createRecipes(List<Recipe> recipes) {
        return recipeRepository.saveAll(recipes);
    }
}
