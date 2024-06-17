import pandas as pd
import matplotlib.pyplot as plt

def load_csv(file_path):
    """Load the CSV file into a DataFrame."""
    return pd.read_csv(file_path)

def analyze_data(df):
    """Perform data analysis."""
    print(df.describe())  # Basic statistics
    # Add more analysis as needed

def plot_data(df):
    """Plot data from DataFrame."""
    df.plot(kind='line')
    plt.show()

if __name__ == "__main__":
    file_path = 'sales_data.csv'
    df = load_csv(file_path)
    analyze_data(df)
    plot_data(df)