import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import pickle
import joblib

#DROP_LIST = ["Recording URL", "Publicly Shared", "Already Watched", "Comments", "Labels", "Created", "Hotjar User ID", "Country", "Referrer URL", "Landing Page URL", "Exit Page URL", 'Device','Device Screen Size', "Incoming Feedback", 'Net Promoter Score®']
DROP_LIST = ["Recording URL", "Publicly Shared", "Already Watched", "Comments", "Labels", "Created", "Hotjar User ID", "Country", "Referrer URL", "Landing Page URL", "Exit Page URL", 'Events\r','Device','Device Screen Size', "Incoming Feedback", 'Net Promoter Score®']
BINARIZE_LIST = ['New / Returning', 'Browser', 'Operating System']
orig_df = pd.read_csv("Data/testt.csv")
#**************************************************** Data Cleaning ****************************************************
# method to drop the columns that are not needed
def drop_columns(df):
    return df.drop(columns=DROP_LIST)

# method to do one hot encoding on the columns that are needed
def oneHot_user(df, column_name):
    key_encoded = pd.get_dummies(df[column_name])
    df = df.join(key_encoded)
    df.drop(columns=[column_name], inplace=True)
    return df

# binarize the columns that are needed using one hot encoding method
def binarize_column(temp_df):
    
    new_df = oneHot_user(temp_df, 'New / Returning')
    browser_df = oneHot_user(new_df, 'Browser')
    
    os_df = oneHot_user(browser_df, 'Operating System')
    check_df = check_missing_columns(os_df)
    return check_df

def check_missing_columns(df):
    # Check if the dataframe has the required columns
    required_columns = ["New user", "Returning user", "Chrome", "Edge", "Windows", 'Facebook', 'Firefox', 'Safari', 'Android']
    missing_columns = set(required_columns) - set(df.columns)

    # Add missing columns with all values being False
    for column in missing_columns:
        df[column] = False

    return df

def order_columns(df):
    print(df)
    # Get the column names of the numerical features
    numerical_features = [col for col in df.columns if col not in ["New user", "Returning user", "Chrome", "Edge", "Facebook", "Firefox", "Safari", "Windows", "iOS", "Mac", "Android"]]
    
    # Order the columns
    df = df[numerical_features + ["New user", "Returning user", "Chrome", "Edge", "Facebook", "Firefox", "Safari", "Android", "Mac", "Windows"]]

    return df

def data_cleaning(file_name):
    # Load the CSV file into a DataFrame
    df = pd.read_csv(file_name)
    df = drop_columns(df)
    df = binarize_column(df)
    df = order_columns(df)
    return df

def data_cleaning_flask(df):
    df = drop_columns(df)
    df = binarize_column(df)
    df = order_columns(df)
    return df

#**************************************************** Data Splitting ****************************************************

def standarize_data(x_test):
    # Get the column names of the numerical features
    numerical_features = [col for col in x_test.columns if col not in ["New user", "Returning user", "Chrome", "Edge", "Facebook", "Firefox", "Safari", "Windows", "iOS", "Mac", "Android"]]
    
    # Load the StandardScaler object from the pickle file
    with open('Saved_Model/scaler.pkl', 'rb') as file:
        scaler = pickle.load(file)

    # Transform the numerical features in x_train and x_test
    x_test[numerical_features] = scaler.transform(x_test[numerical_features])

    return x_test

def pca_data(x_test):
    #print(x_test)
    # Load the PCA object from the pickle file
    with open('Saved_Model/pca_model.pkl', 'rb') as file:
        pca = pickle.load(file)

    x_test_pca = pca.transform(x_test)

    return x_test_pca

def predict(x_test_pca):
    # Load the model from the pickle file
    #with open('svm_model.pkl', 'rb') as file:
        #model = pickle.load(file)

    model = joblib.load('Saved_Model/svm_model.pkl')
    # Predict the target values
    #y_pred = model.decision_function(x_test_pca)
    y_pred = model.predict(x_test_pca)

    return y_pred

def get_prediction(file_name):
    df = data_cleaning(file_name)
    #print(df)
    x_test = standarize_data(df)
    x_test_pca = pca_data(x_test)
    y_pred = predict(x_test_pca)

    return y_pred

def get_prediction_flask(df):
    df = data_cleaning_flask(df)
    #print(df)
    x_test = standarize_data(df)
    x_test_pca = pca_data(x_test)
    y_pred = predict(x_test_pca)

    return y_pred
    
#print(get_prediction('testt.csv'))


