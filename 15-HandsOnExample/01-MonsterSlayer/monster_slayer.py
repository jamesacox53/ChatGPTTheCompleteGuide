import random

def attack(regular=True, difficulty="Medium"):
    """ Calculate the damage for a regular or strong attack based on difficulty. """
    if regular:
        if difficulty == "Easy":
            return random.randint(8, 15)
        elif difficulty == "Medium":
            return random.randint(5, 12)
        else:  # Hard
            return random.randint(3, 10)
    else:
        if difficulty == "Easy":
            return random.randint(15, 30)
        elif difficulty == "Medium":
            return random.randint(10, 25)
        else:  # Hard
            return random.randint(8, 20)

def heal(difficulty="Medium"):
    """ Calculate the heal value based on difficulty. """
    if difficulty == "Easy":
        return random.randint(15, 25)
    elif difficulty == "Medium":
        return random.randint(8, 20)
    else:  # Hard
        return random.randint(5, 15)

def monster_attack(difficulty="Medium"):
    """ Calculate the monster's attack damage based on difficulty. """
    if difficulty == "Easy":
        return random.randint(5, 10)
    elif difficulty == "Medium":
        return random.randint(10, 15)
    else:  # Hard
        return random.randint(12, 20)

def game():
    player_health = 100
    monster_health = 100
    turn_count = 0
    
    username = input("Enter your username: ")
    print(f"Welcome, {username}, to Monster Slayer!")
    
    print("Choose difficulty level:")
    print("1. Easy")
    print("2. Medium")
    print("3. Hard")
    difficulty_choice = int(input("Enter the number of your chosen difficulty: "))
    difficulty_levels = {1: "Easy", 2: "Medium", 3: "Hard"}
    difficulty = difficulty_levels.get(difficulty_choice, "Medium")
    
    print(f"Difficulty level set to: {difficulty}")
    
    while player_health > 0 and monster_health > 0:
        turn_count += 1
        print(f"\n-- Turn {turn_count} --")
        print(f"{username} Health: {player_health}")
        print(f"Monster Health: {monster_health}")
        
        # Player's turn
        print("Choose your action:")
        actions = ["Regular Attack"]
        if turn_count % 3 == 0:
            actions.append("Strong Attack")
        if turn_count % 5 == 0:
            actions.append("Heal")
        
        for i, action in enumerate(actions):
            print(f"{i + 1}. {action}")
        
        choice = int(input("Enter the number of your action: "))
        
        if actions[choice - 1] == "Regular Attack":
            damage = attack(regular=True, difficulty=difficulty)
            monster_health -= damage
            print(f"You dealt {damage} damage to the monster.")
        elif actions[choice - 1] == "Strong Attack":
            damage = attack(regular=False, difficulty=difficulty)
            monster_health -= damage
            print(f"You dealt {damage} damage to the monster.")
        elif actions[choice - 1] == "Heal":
            healing = heal(difficulty=difficulty)
            player_health += healing
            player_health = min(player_health, 100)  # Cap the player's health at 100
            print(f"You healed yourself for {healing} health.")
        
        if monster_health <= 0:
            print("The monster is defeated! You win!")
            break
        
        # Monster's turn
        monster_damage = monster_attack(difficulty=difficulty)
        player_health -= monster_damage
        print(f"The monster dealt {monster_damage} damage to you.")
        
        if player_health <= 0:
            print("You have been defeated by the monster! Game over.")
            break
    
    print("\nGame Over")
    restart = input("Do you want to play again? (yes/no): ").lower()
    if restart == "yes":
        game()
    else:
        print("Thanks for playing Monster Slayer!")

if __name__ == "__main__":
    game()