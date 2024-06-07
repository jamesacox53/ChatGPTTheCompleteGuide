import random

def attack(regular=True):
    """ Calculate the damage for a regular or strong attack. """
    if regular:
        return random.randint(5, 12)  # Regular attack
    else:
        return random.randint(10, 25)  # Strong attack

def heal():
    """ Calculate the heal value. """
    return random.randint(8, 20)

def monster_attack():
    """ Calculate the monster's attack damage. """
    return random.randint(10, 15)

def game():
    player_health = 100
    monster_health = 100
    turn_count = 0
    
    print("Welcome to Monster Slayer!")
    
    while player_health > 0 and monster_health > 0:
        turn_count += 1
        print(f"\n-- Turn {turn_count} --")
        print(f"Player Health: {player_health}")
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
            damage = attack()
            monster_health -= damage
            print(f"You dealt {damage} damage to the monster.")
        elif actions[choice - 1] == "Strong Attack":
            damage = attack(regular=False)
            monster_health -= damage
            print(f"You dealt {damage} damage to the monster.")
        elif actions[choice - 1] == "Heal":
            healing = heal()
            player_health += healing
            player_health = min(player_health, 100)  # Cap the player's health at 100
            print(f"You healed yourself for {healing} health.")
        
        if monster_health <= 0:
            print("The monster is defeated! You win!")
            break
        
        # Monster's turn
        monster_damage = monster_attack()
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