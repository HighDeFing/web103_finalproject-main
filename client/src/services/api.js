const API_URL = "http://localhost:3000";

// AUTH API
export const signUpUser = async (username, email, password) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to sign up");
    }

    return data;
  } catch (error) {
    console.error("Sign up error:", error);
    throw error;
  }
};
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      throw new Error(data.error || "Failed to log in");
    }

    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const updateUser = async (userId, updates) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/updateUser`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, ...updates }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to update user");
    }

    return data;
  } catch (error) {
    console.error("Update user error:", error);
    throw error;
  }
};

// BUDGET API
export const createBudget = async (userId, plan, budgetName, month, year) => {
  const budgetData = {
    user_id: userId,
    plan,
    budget_name: budgetName,
    month,
    year,
  };

  try {
    const response = await fetch(`${API_URL}/api/budget/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(budgetData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const newBudget = await response.json();
    return newBudget;
  } catch (error) {
    console.error("Error creating budget:", error);
    throw error;
  }
};

export const getBudgetsByUserId = async (userId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/budget/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // // Log the fetched budgets to inspect month and year
    // console.log(
    //   "Fetched Budgets:",
    //   data.map((budget) => ({
    //     id: budget.id,
    //     name: budget.budget_name,
    //     month: budget.month,
    //     year: budget.year,
    //     track: budget.keep_track,
    //   }))
    // );
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching budgets:", error);
    throw error; // Rethrow the error so it can be handled by the calling code
  }
};

export const fetchActualIncomes = async (userId, budgetId) => {
  const response = await fetch(
    `${API_URL}/api/income/actual/${userId}/${budgetId}`
  );
  if (!response.ok)
    throw new Error(`Error fetching incomes: ${response.status}`);
  return response.json();
};

export const fetchActualExpenses = async (userId, budgetId) => {
  const response = await fetch(
    `${API_URL}/api/expense/actual/${userId}/${budgetId}`
  );
  if (!response.ok)
    throw new Error(`Error fetching expenses: ${response.status}`);
  return response.json();
};

export const fetchExpectedIncomes = async (userId, budgetId) => {
  const response = await fetch(
    `${API_URL}/api/income/predicted/${userId}/${budgetId}`
  );
  if (!response.ok)
    throw new Error(`Error fetching expected incomes: ${response.status}`);
  return response.json();
};

export const fetchExpectedExpenses = async (userId, budgetId) => {
  const response = await fetch(
    `${API_URL}/api/expense/predicted/${userId}/${budgetId}`
  );
  if (!response.ok)
    throw new Error(`Error fetching expected expenses: ${response.status}`);
  return response.json();
};

export const processRow = async (row, type, status) => {
  const isUpdate = row.id && row.id !== "";
  const url = isUpdate
    ? `${API_URL}/api/${type}/${status}/update`
    : `${API_URL}/api/${type}/${status}/addbulk`;
  const method = isUpdate ? "PATCH" : "POST";
  const body = {
    ...row,
    id: isUpdate ? row.id : undefined, // Remove id for POST requests
  };
  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `HTTP error! status: ${response.status}, response: ${errorText}`
    );
  }
  return response.json();
};

export const deleteRow = async (row, status) => {
  const url = `${API_URL}/api/${row.type}/${status}/delete`;
  const body = {
    id: row.id,
    budget_id: row.budget_id,
  };

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `HTTP error! status: ${response.status}, response: ${errorText}`
    );
  }
};

// GOOGLE AUTH API
export const parseOAuthFragment = () => {
  const hash = window.location.hash.substring(1); // Get the URL fragment after '#'
  const params = new URLSearchParams(hash);
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");

  return { accessToken, refreshToken };
};

// Function to handle the OAuth callback
export const handleOAuthCallback = async (accessToken, refreshToken) => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/auth/oauth-callback",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessToken, refreshToken }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "OAuth callback failed");
    }
    return await response.json();
  } catch (error) {
    console.error("Error handling OAuth callback:", error);
    throw error;
  }
};

export const deleteIncomesActualBulk = async (ids, budgetId) => {
  const url = `${API_URL}/api/income/actual/deletebulk`;
  const body = {
    ids,
    budget_id: budgetId,
  };

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `HTTP error! status: ${response.status}, response: ${errorText}`
    );
  }

  return response.json();
};

export const deleteExpensesActualBulk = async (ids, budgetId) => {
  const url = `${API_URL}/api/expense/actual/deletebulk`;
  const body = {
    ids,
    budget_id: budgetId,
  };

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `HTTP error! status: ${response.status}, response: ${errorText}`
    );
  }

  return response.json();
};

export const deleteIncomesPredictedBulk = async (ids, budgetId) => {
  const url = `${API_URL}/api/income/predicted/deletebulk`;
  const body = {
    ids,
    budget_id: budgetId,
  };

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `HTTP error! status: ${response.status}, response: ${errorText}`
    );
  }

  return response.json();
};

export const deleteExpensesPredictedBulk = async (ids, budgetId) => {
  const url = `${API_URL}/api/expense/predicted/deletebulk`;
  const body = {
    ids,
    budget_id: budgetId,
  };

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `HTTP error! status: ${response.status}, response: ${errorText}`
    );
  }

  return response.json();
};

export const updateKeepTrack = async (budgetId, userId, keepTrack) => {
  const url = `${API_URL}/api/budget/keeptrack`;
  const body = {
    budget_id: budgetId,
    user_id: userId,
    keep_track: keepTrack,
  };

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `HTTP error! status: ${response.status}, response: ${errorText}`
    );
  }

  return response.json();
};

export const getBudgetById = async (budgetId) => {
  try {
    const response = await fetch(`${API_URL}/api/budget/budget/${budgetId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching budget:", error);
    throw error;
  }
};

export const updateBudget = async (budgetId, updates) => {
  try {
    const response = await fetch(`${API_URL}/api/budget/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ budgetId, ...updates }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating budget:", error);
    throw error;
  }
};
