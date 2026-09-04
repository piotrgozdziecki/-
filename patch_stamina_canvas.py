import re

with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

# Remove the DOM stamina bar CSS and HTML
text = re.sub(r'    \.stamina-bar-container \{.*?\n    \}', '', text, flags=re.DOTALL)
text = re.sub(r'    \.stamina-bar-fill \{.*?\n    \}', '', text, flags=re.DOTALL)
text = re.sub(r'  <div class="stamina-bar-container">.*?</div>\n  </div>', '', text, flags=re.DOTALL)
text = text.replace("const staminaBar = document.getElementById('stamina-bar');", "")
text = text.replace("  staminaBar.style.width = `${(player.stamina / player.maxStamina) * 100}%`;\n", "")

# Add Canvas stamina drawing
canvas_stamina = """    ctx.fillStyle = '#fcd34d';
    ctx.beginPath(); ctx.arc(10 + legOffset, -14, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(10 - legOffset, 14, 4, 0, Math.PI * 2); ctx.fill();
  }

  // Draw Stamina Bar below player
  if (player.stamina < player.maxStamina || player.isForklift) {
    ctx.restore(); // pop the translate+rotate for the player, now we just have translate
    ctx.save();
    ctx.translate(player.x, player.y);
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(-16, 26, 32, 5);
    
    ctx.fillStyle = player.isForklift ? '#facc15' : '#fbbf24';
    const fillW = Math.max(0, (player.stamina / player.maxStamina) * 30);
    ctx.fillRect(-15, 27, fillW, 3);
  }"""
text = text.replace("""    ctx.fillStyle = '#fcd34d';
    ctx.beginPath(); ctx.arc(10 + legOffset, -14, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(10 - legOffset, 14, 4, 0, Math.PI * 2); ctx.fill();
  }""", canvas_stamina)

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
