import csv
from django.http import HttpResponse
from django.shortcuts import render, redirect
from .models import  Submission, Variable, Creator, AdditionalMetadata

def submit_form(request):
    if request.method == 'POST':
        dataset_title = request.POST.get('title', '').strip()
        submission = Submission.objects.create(dataset_title=dataset_title)
        # === Save Variable data ===
        long_names = request.POST.getlist('long_name')
        standard_names = request.POST.getlist('standard_name')
        types = request.POST.getlist('type')
        column_numbers = request.POST.getlist('column_number')
        units_list = request.POST.getlist('units')

        for i in range(len(long_names)):
            Variable.objects.create(
                submission=submission,
                long_name=long_names[i],
                standard_name=standard_names[i] if i < len(standard_names) else '',
                type=types[i] if i < len(types) else '',
                column_number=column_numbers[i],
                units=units_list[i],
            )

        # === Save Creators/Contributors ===
        roles = request.POST.getlist('person_role')
        names = request.POST.getlist('person_name')
        person_column_numbers = request.POST.getlist('person_column_number')
        institutions = request.POST.getlist('institution')
        additional_creator_infos=request.POST.getlist('additional_creator_info')

        for i in range(len(names)):
            Creator.objects.create(
                submission=submission,
                name=names[i],
                person_column_number=person_column_numbers[i],
                role=roles[i],
                institution=institutions[i],
                additional_creator_info =  additional_creator_infos[i]
            )

        # === Save Additional Metadata ===
        metadata_types = request.POST.getlist('metadata_type')
        metadata_values = request.POST.getlist('metadata_value')
        metadata_column_numbers = request.POST.getlist('metadata_column_number')

        for i in range(len(metadata_types)):
            AdditionalMetadata.objects.create(
                submission=submission,
                metadata_type=metadata_types[i],
                metadata_column_number = metadata_column_numbers[i],
                metadata_value=metadata_values[i]
            )

        # Create the CSV response
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="submission_{submission.id}.csv"'
        writer = csv.writer(response)
        writer.writerow(['Conventions', 'G', 'BADC-CSV', 1])
        # Title
        writer.writerow(['title','G', submission.dataset_title])
        # Creators
        for person in submission.creators.all():
            writer.writerow([person.role, person.person_column_number, person.name, person.institution, person.additional_creator_info])
        # Variables
        for var in submission.variables.all():
            writer.writerow(['long_name', var.column_number, var.long_name, var.units])
            if var.standard_name: 
                writer.writerow(['standard_name', var.column_number, var.standard_name])
            if var.type: 
                writer.writerow(['type', var.column_number, var.type])
        # Metadata
        for meta in submission.metadata.all():
            writer.writerow([meta.metadata_type, meta.metadata_column_number, meta.metadata_value])
        writer.writerow(['data'])
        writer.writerow([])
        writer.writerow(['end data'])

        return response  # Return the CSV file as the HTTP response

    return render(request, 'formapp/form.html')

def form_submitted(request):
    return render(request, 'formapp/thanks.html')