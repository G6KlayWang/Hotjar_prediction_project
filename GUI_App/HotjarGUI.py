import tkinter as tk
from tkinter import filedialog
import pandas as pd
import Util

def load_input():
    # Open a dialog to choose the input CSV file
    file_path = filedialog.askopenfilename()
    #print(file_path)
    processed_according_to_user(file_path)
    
def save_output(df, predictions):
    # Open a dialog to save the processed CSV file
    file_path = filedialog.asksaveasfilename(defaultextension='.csv')

    df['Target'] = predictions
    # Save the DataFrame to a CSV file
    df.to_csv(file_path, index=False)

def processed_according_to_user(file_name):
    df = pd.read_csv(file_name)
    predictions = Util.get_prediction(file_name)
    
    # Add the index column to the DataFrame
    df['Index'] = df.index
    df['Prediction'] = predictions  # Assume predictions is a list or Series
    
    # Formatting the output as a matrix in the GUI
    formatted_output = df[['Index', 'Prediction']].to_string(index=False)
    prediction_label.config(text=f"Predictions and Index:\n{formatted_output}")

    save_output(df, predictions)

def open_file():
    df = load_input()
    #save_output(processed_df)

def exit_program():
    root.destroy()

# Set up the GUI
root = tk.Tk()
root.title("CSV Processor")

open_button = tk.Button(root, text="Open CSV", command=open_file)
open_button.pack(pady=20)

# Add a label to display the prediction results

prediction_label = tk.Label(root, text="")
prediction_label.pack(pady=10)

# Add an exit button to exit the program
exit_button = tk.Button(root, text="Exit", command=exit_program)
exit_button.pack(pady=10)


root.mainloop()

