import os
import boto3
import pandas as pd
from flask import Flask, jsonify
from botocore.exceptions import ClientError
from datetime import datetime
from dateutil.relativedelta import relativedelta
import threading
import time

# Initialize Flask app
app = Flask(__name__)

# Load environment variables (already set in the terminal)
aws_access_key_id = os.getenv("AKIAUJ3VUACNXWVMJXKJ")
aws_secret_access_key = os.getenv("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")
aws_region = os.getenv('eu-north-1')

# Initialize DynamoDB client (Database)
dynamodb = boto3.resource(
    'dynamodb',
    region_name="eu-north-1",
    aws_access_key_id="AKIAUJ3VUACNXWVMJXKJ",
    aws_secret_access_key="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"
)

#Dynamodb Tables 
table = dynamodb.Table('SensorData')
table2 = dynamodb.Table('AWS_HourlyData_24hrs')  
table3 = dynamodb.Table('AWS_MonthlyData_30or31Days') 

resetDateInt = 1 #Monthly data resets at this day

#Returns the reset date in datetime format
def setResetDate(resetDateInt):
    current_date = datetime.now()
    current_month = current_date.month
    current_year = current_date.year    

    resetDateStr = str(resetDateInt)+"-"+str(current_month)+"-"+str(current_year)+" 00:00:00"
    date_time = pd.to_datetime(resetDateStr, format='%d-%m-%Y %H:%M:%S')
    next_month_date = date_time + relativedelta(months=1)
    print(next_month_date)
    return next_month_date



#variables for sending hompage data 
lastMinuteUsage = 0
lastHourUsage = 0
LasthourPeak = 0



# Lock for synchronization (shared resource access)
#for homepage data
data_lock_homeData = threading.Lock()

#for database access
data_lock_dataBase = threading.Lock()


#Insert the hourly usage to the within day usage data table
def set_data_day(df):
        
        total_watt_hour = df['Watt-Hour'].sum()
        lastHourUsage = total_watt_hour #to send as hompage data
        
        try:
            # Prepare the data item to insert
            item = {
                'DateTime': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),  # Convert DateTime to string
                'Watt-Hour': total_watt_hour
            }
            
            with data_lock_dataBase:
                # Insert the item into the DynamoDB table
                table2.put_item(Item=item)
                print("Data inserted successfully - Daily")

        except Exception as e:
            print(f"Error inserting data: Daily {e}")

#get the data from the database (24hrs usage)
def get_data_day():
        with data_lock_dataBase:
            response = table2.scan(Limit=24)

        items = response.get('Items', [])
        df = pd.DataFrame(items)

        end_time = pd.Timestamp.now()
        start_time = end_time - pd.Timedelta(hours=24)

        # Ensure DateTime is in datetime format
        df['DateTime'] = pd.to_datetime(df['DateTime'])
        #df = df.sort_values(by='DateTime')

        # Filter the data for the last 24 hours
        df = df[(df['DateTime'] >= start_time) & (df['DateTime'] <= end_time)]

        # Step 2: Set DateTime as the index
        df.set_index('DateTime', inplace=True)

        # Step 3: Resample data to hourly intervals, summing Watt-Hour values and filling missing hours with 0
        df_resampled = df['Watt-Hour'].resample('1H').sum().fillna(0)

        # Step 4: Ensure exactly 24 records by reindexing with the last 24 hours
        # Create an hourly index from the start time to the end time
        hourly_index = pd.date_range(start=start_time, end=end_time, freq='H')

        # Reindex the resampled data to ensure 24 records (any missing hours will have 0)
        df_resampled = df_resampled.reindex(hourly_index, fill_value=0)

        # Reset the index if you prefer 'DateTime' as a column again
        df_resampled = df_resampled.reset_index()
        df_resampled.columns = ['DateTime', 'Watt-Hour']

        return df_resampled





#Saves the total usage within the day to the data table of monthly usage
def set_data_month():
    
        with data_lock_dataBase:
            response = table2.scan(Limit=24)


        items = response.get('Items', [])
        df = pd.DataFrame(items)
        total_watt_hour = df['Watt-Hour'].sum()

        if datetime.now().date() == resetDateInt:
            clear_dynamodb_table(table2,"DateTime")

        try:
            # Prepare the data item to insert
            item = {
                'DateTime': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),  # Convert DateTime to string
                'Usage': total_watt_hour
            }
            
            # Insert the item into the DynamoDB table


            with data_lock_dataBase:
                table3.put_item(Item=item)

            print("Data inserted successfully - Monthly")

        except Exception as e:
            print(f"Error inserting data: Monthly {e}")



#Starting from the lowest day in the database, till one monnth to the future 
def get_data_month():

    with data_lock_dataBase:
        response = table3.scan()

    items = response.get('Items', [])
    df = pd.DataFrame(items)

       # Ensure 'DateTime' column is in datetime format
    df['DateTime'] = pd.to_datetime(df['DateTime'])
    df.columns = ['Watt-Hour', 'DateTime']

    # Sort by DateTime
    df = df.sort_values(by='DateTime')

    # Find the start date (one month ahead of the resetdate from this month)
    end_date = setResetDate(resetDateInt)

    #Start date - month before the end_date 
    start_date = end_date + pd.DateOffset(months=-1)

    #print(start_date)
    #print(end_date)
    # Calculate the end date (one month from the start date)

    # Create a date range from start_date to end_date (one month)
    date_range = pd.date_range(start=start_date, end=end_date, freq='D')

    # Reindex the DataFrame to fill missing dates with 0 for 'Watt-Hour'
    df.set_index('DateTime', inplace=True)
    df = df.reindex(date_range, fill_value=0)
    df.index.name = 'DateTime'
    df.reset_index(inplace=True)

    # Rename columns to match the expected format
    df.columns = ['DateTime', 'Watt-Hour']
    return df
#Get usage by minute from the data table
#Convertions and then get the usage within an hour
#Add data to the necessary tables and returns the hourly usage
def get_data_hour():
    try:
        # Retrieve data from the table
        with data_lock_dataBase:
            response = table.scan()

        items = response.get('Items', [])
        
        # Convert items to DataFrame
        df = pd.DataFrame(items)

        # Drop unnecessary column and sort by timestamp
        df = df.drop(columns=['TimeStamp'])
        df = df.sort_values(by='TS')
        
        # Convert TS to int64 to handle large integers, then to datetime
        df['TS'] = df['TS'].astype('int64')

        #convert the timestamp to datetime format
        #convert to local time
        #remove the +5:30 mark
        #round to the nearest minute
        df['DateTime'] = pd.to_datetime(df['TS'], unit='ms', utc=True).dt.tz_convert('Asia/Colombo').dt.tz_localize(None).dt.floor('T')
              
              
              #df['DateTime'] = pd.to_datetime(df['TS'], unit='ms', utc=True).dt.tz_convert('Asia/Colombo')
        #df['DateTime'] = df['DateTime'].apply(lambda dt: dt.replace(second=0, microsecond=0))

        # Create a new DataFrame with relevant columns and set DateTime as index
        new_df = df[['Watt-Hour', 'DateTime']].copy()
        new_df.set_index('DateTime', inplace=True)
        #print(new_df)
        # Define the time range for the last hour
        end_time = pd.Timestamp.now(tz='Asia/Colombo').tz_localize(None).floor('T')- pd.Timedelta(minutes=2) #always get values starting from 2 minutes before


        start_time = end_time - pd.Timedelta(hours=1)

        # Generate a date range for each minute within the last hour


        all_minutes = pd.date_range(start=start_time, end=end_time, freq='1T')

        # Resample data to 1-minute intervals, filling missing minutes with 0
        df_resampled = new_df['Watt-Hour'].resample('1T').sum().reindex(all_minutes, fill_value=0)

        #print(df_resampled)

        # Reset the index for easier handling, and rename columns
        df_resampled = df_resampled.reset_index()
        df_resampled.columns = ['DateTime', 'Watt-Hour']
        
        # Filter data for the specified time range
        df_first_hour = df_resampled[(df_resampled['DateTime'] >= start_time) & (df_resampled['DateTime'] <= end_time)]

        print(df_first_hour)  # Display usage data within the last hour



        #Calculations for home dataset
        with data_lock_homeData:
            lastMinuteUsage = df_first_hour["Watt-Hour"].iloc[-1]

            print(lastMinuteUsage)

            total_watt_hour = df_first_hour['Watt-Hour'].sum()
            lastHourUsage = total_watt_hour
            print(lastHourUsage)
            LasthourPeak = df["Watt-Hour"].max()
            print(LasthourPeak)


        return df_first_hour
    

    except ClientError as e:
        print(e)



 
#run hour by hour to update the hourly usage
def addDataHourly():    
    print("Thread 1 running")
    while True:
        
        if datetime.now().minute == 0:
            try:
                df_first_hour = pd.DataFrame(get_data_hour())
                set_data_day(df_first_hour)
                print(f"send to insert - minute{datetime.now()}")
                time.sleep(60)

            except Exception as e:
                print("Couldn't add hourly data to the db :{e}") 
                #Trying again to insert in  20 seconds 
        else:
            time.sleep(20)

#run each day to update the monthly usage
def addDataDaily():
    print("Thread 2 running")
    while True:   
        #add data of each day to monthly record
        #Should not turn on within the 00:00 more than once (multiple rows can be added)
        if datetime.now().hour == 00 and datetime.now().minute == 00 :
                try:
                    set_data_month()
                    print(f"send to insert - day{datetime.now()}")
                    time.sleep(86400)  # 86400 seconds = 1 day

                except Exception as e:
                    print("Couldt add daily data to the db :{e}")

        else:
            time.sleep(20)#Trying again to insert in  20 seconds 
            
#To do : If insertion didnt go as planned, get an error handling mechanism



#Delete all the elements from the table
def clear_dynamodb_table(dynamodb_table, primary_key):
    # Access the DynamoDB table
    try:
        # Start scanning with pagination
        while True:
            # Scan the table to retrieve a chunk of items
            with data_lock_dataBase:
                response = dynamodb_table.scan()

            items = response.get('Items', [])
            
            # Delete each item in the current response chunk
            with data_lock_dataBase:
                with dynamodb_table.batch_writer() as batch:
                    for item in items:
                        print(f"Deleting item with {primary_key} = {item[primary_key]}")  # Debug print
                        batch.delete_item(Key={primary_key: item[primary_key]})

            # If no more items are left, break the loop
            if 'LastEvaluatedKey' not in response:
                break

        print("All items deleted successfully")
    except Exception as e:
        print(f"Error: {e}")



@app.route('/Hourdata', methods=['GET'])
def get_data_withinHour():
    try:
        
        df = pd.DataFrame(get_data_hour())
        print(df)

        # Return the DataFrame data as JSON (for demonstration purposes)
        return df.to_json(orient="records"), 200

    except ClientError as e:
        print(e.response['Error']['Message'])
        return jsonify({"error": e.response['Error']['Message']}), 500
    


@app.route('/DayData', methods=['GET'])
def get_data_withinDay():
    try:
        
        df = pd.DataFrame(get_data_day())
        print(df)

        # Return the DataFrame data as JSON (for demonstration purposes)
        return df.to_json(orient="records"), 200

    except ClientError as e:
        print(e.response['Error']['Message'])
        return jsonify({"error": e.response['Error']['Message']}), 500    


@app.route('/MonthData', methods=['GET'])
def get_data_withinMonth():
    try:
        
        df = pd.DataFrame(get_data_month())
        print(df)

        # Return the DataFrame data as JSON (for demonstration purposes)
        return df.to_json(orient="records"), 200

    except ClientError as e:
        print(e.response['Error']['Message'])
        return jsonify({"error": e.response['Error']['Message']}), 500    












@app.route('/get_homepage_data', methods=['GET'])
def get_homepage_data():
    try:
        print("Waiting for lock")
        with data_lock_homeData:            
            return jsonify({"lastMinuteUsage": lastMinuteUsage, "lastHourUsage": lastHourUsage, "lastHourPeak": LasthourPeak}), 200
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500

#df = pd.DataFrame(get_data_hour())
#set_data_day(df)
#set_data_month()

#clear_dynamodb_table(table2,"DateTime")
#enable_ttl('your-table-name', 'expirationTime')
#get_data_hour()
#get_data_withinHour()
#setResetDate(resetDateInt)
#set_data_month()
#set_data_month()
#print(get_data_month())

if __name__ == '__main__':

    backgroundThreadHourly = threading.Thread(target= addDataHourly,  daemon = True)
    backgroundThreadDaily = threading.Thread(target= addDataDaily,  daemon = True)

    backgroundThreadHourly.start()
    backgroundThreadDaily.start()

    #server
    app.run(host='192.168.56.1', port=5000, debug=True)  




#To be checked : must recieve the lates values from the database. (Spaces couses between values)
