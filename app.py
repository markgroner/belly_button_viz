from flask import Flask, jsonify, render_template
import pandas as pd

app = Flask(__name__)

"""Return the dashboard homepage."""
@app.route("/")
def hom():
    return render_template('index.html')



"""List of sample names.

Returns a list of sample names in the format
[
    "BB_940",
    "BB_941",
    "BB_943",
    "BB_944",
    "BB_945",
    "BB_946",
    "BB_947",
    ...
]

"""
@app.route('/names')
def names():
    samples_df = pd.read_csv('DataSets/belly_button_biodiversity_samples.csv')
    sample_names = samples_df.columns.values.tolist()
    return jsonify(sample_names)



"""List of OTU descriptions.

Returns a list of OTU descriptions in the following format

[
    "Archaea;Euryarchaeota;Halobacteria;Halobacteriales;Halobacteriaceae;Halococcus",
    "Archaea;Euryarchaeota;Halobacteria;Halobacteriales;Halobacteriaceae;Halococcus",
    "Bacteria",
    "Bacteria",
    "Bacteria",
    ...
]
"""
@app.route('/otu')
def otu():
    out_id_df = pd.read_csv('DataSets/belly_button_biodiversity_otu_id.csv')
    OTU_descriptions = out_id_df['lowest_taxonomic_unit_found'].tolist()
    return jsonify(OTU_descriptions)



def sample_to_dict(sample_id, column_list):
    sample = samples_df[samples_df['SAMPLEID'] == int(sample)]
    json_keys = column_list
    sample_filtered_cols = sample[json_keys]
    final_sample_dict = sample_filtered_cols.to_dict(orient='index')[0]
    return final_sample_dict


"""MetaData for a given sample.

Args: Sample in the format: `BB_940`

Returns a json dictionary of sample metadata in the format

{
    AGE: 24,
    BBTYPE: "I",
    ETHNICITY: "Caucasian",
    GENDER: "F",
    LOCATION: "Beaufort/NC",
    SAMPLEID: 940
}
"""
@app.route('/metadata/<sample>')
def metadata(sample):
    samples_df = pd.read_csv('DataSets/Belly_Button_Biodiversity_Metadata.csv')
    json_keys = ['AGE', 'BBTYPE', 'ETHNICITY', 'GENDER', 'LOCATION', 'SAMPLEID']
    final_sample_dict = sample_to_dict(sample, json_keys)
    return jsonify(final_sample_dict)







"""Weekly Washing Frequency as a number.

Args: Sample in the format: `BB_940`

Returns an integer value for the weekly washing frequency `WFREQ`
"""
@app.route('/wfreq/<sample>')
def wfreq(sample):
    samples_df = pd.read_csv('DataSets/Belly_Button_Biodiversity_Metadata.csv')
    json_keys = ['WFREQ']
    final_sample_dict = sample_to_dict(sample, json_keys)
    return jsonify(final_sample_dict)




"""OTU IDs and Sample Values for a given sample.

Sort your Pandas DataFrame (OTU ID and Sample Value)
in Descending Order by Sample Value

Return a list of dictionaries containing sorted lists  for `otu_ids`
and `sample_values`

[
    {
        otu_ids: [
            1166,
            2858,
            481,
            ...
        ],
        sample_values: [
            163,
            126,
            113,
            ...
        ]
    }
]
"""
@app.route('/samples/<sample>')
def samples(sample):
    samples_df = pd.read_csv('DataSets/belly_button_biodiversity_samples.csv')
    sample_filtered = samples_df[['otu_id', sample]]
    sample_sorted = sample_filtered.sort_values(sample, ascending=False)
    otu_ids = sample_sorted['otu_id'].tolist()
    sample_values = sample_sorted[sample].tolist()
    json = [{'otu_ids': otu_ids}, {'sample_values': sample_values}]
    return jsonify(json)



if __name__ == "__main__":
    app.run(debug=True)
