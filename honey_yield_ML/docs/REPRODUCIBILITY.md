# Reproducibility

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Place the three full Honey Production CSVs in `data/` using these names:

```text
Honey_Production_Dataset_2023.csv
Honey_Production_Dataset_2024_Ideal.csv
Honey_Production_Dataset_2024_NonIdeal.csv
```

3. Train:

```bash
python src/train_model.py
```

4. Evaluate the packaged report:

```bash
python src/evaluate_model.py
```

5. Predict from a history CSV:

```bash
python src/predict.py path/to/history.csv
```

The repository's committed model is the prototype artifact. Retraining will overwrite it.
