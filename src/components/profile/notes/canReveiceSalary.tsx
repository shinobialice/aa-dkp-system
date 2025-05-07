function canReceiveSalary(user: User): boolean {
    const now = new Date();
    const joined = new Date(user.joined_at);
    const joinedDay = joined.getDate();
    const monthsPassed =
      now.getFullYear() * 12 +
      now.getMonth() -
      (joined.getFullYear() * 12 + joined.getMonth());
  
    const probationDone =
      (joinedDay <= 20 && monthsPassed >= 1) ||
      (joinedDay > 20 && monthsPassed >= 2);
  
    const passesGearScore = checkGearScore(user);
  
    return probationDone && passesGearScore;
  }
  